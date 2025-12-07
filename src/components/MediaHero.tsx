import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { strings } from '../app/strings';
import Icon from '../design-system/Icon';
// Lazy load expo-av and type safely
import type {
  Video as VideoType,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode as ResizeModeType,
} from 'expo-av';
let Video: typeof VideoType | null = null;
let ResizeMode: typeof ResizeModeType | { COVER: 'cover' } = { COVER: 'cover' };
try {
  const av = require('expo-av');
  Video = av.Video;
  ResizeMode = av.ResizeMode;
} catch {}

type Props = {
  uri: string;
  videoUri?: string;
  loop?: boolean;
  muted?: boolean;
};

export default function MediaHero({ uri, videoUri, loop = true, muted = true }: Props) {
  const ref = React.useRef<unknown>(null);
  const [playing, setPlaying] = React.useState(false);

  const onToggle = async () => {
    if (!videoUri) return;
    const video = ref.current as VideoType | null;
    const status = await video?.getStatusAsync?.();
    if (status && 'isLoaded' in status && status.isLoaded && status.isPlaying) {
      await video?.pauseAsync?.();
      setPlaying(false);
    } else {
      await video?.playAsync?.();
      setPlaying(true);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if ('isLoaded' in status && status.isLoaded) {
      const s = status as AVPlaybackStatusSuccess;
      setPlaying(s.isPlaying);
      if (s.didJustFinish && !loop) setPlaying(false);
    }
  };
  return (
    <View style={styles.container}>
      {videoUri && Video ? (
        <Video
          // ref typed as unknown; cast inside handlers
          ref={ref as React.RefObject<VideoType>}
          source={{ uri: videoUri }}
          style={styles.image}
          // @ts-expect-error ResizeMode type at runtime
          resizeMode={ResizeMode.COVER}
          isLooping={loop}
          shouldPlay={false}
          isMuted={muted}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      ) : (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.overlay}>
        <TouchableOpacity onPress={onToggle} activeOpacity={0.8} disabled={!videoUri}>
          <View style={styles.playButton}>
            <Icon name={playing ? 'pause' : 'play'} size={28} color={colors.navText} />
          </View>
        </TouchableOpacity>
      </View>
      {!playing && (
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>{strings.mediaSeeProgress}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.cardOutline,
  },
  image: { width: '100%', height: 220 },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 16,
  },
  bottomText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
