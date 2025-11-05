import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';

interface SafeImageProps extends ImageProps {
  fallbackIcon?: boolean;
}

export function SafeImage({ source, style, fallbackIcon = true, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError && fallbackIcon) {
    return (
      <View style={[style, styles.fallback]}>
        <ImageIcon size={32} color="#666" strokeWidth={2} />
      </View>
    );
  }

  return (
    <Image
      {...props}
      source={source}
      style={style}
      onError={() => setHasError(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
});


