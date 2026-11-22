import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const inactive = disabled || loading;
  const secondary = variant === 'secondary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        inactive && styles.inactive,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, secondary && styles.textSecondary]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary },
  inactive: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  text: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  textSecondary: { color: colors.primary },
});
