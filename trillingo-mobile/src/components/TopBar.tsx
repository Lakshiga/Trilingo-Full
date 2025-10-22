import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, shadow } from '../theme/designSystem';
import PawLogo from './PawLogo';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  title?: string;
  onUpdateProfile?: () => void;
  onLogout?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Trillingo', onUpdateProfile, onLogout }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout && onLogout();
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <PawLogo size={28} color={colors.info} />
        <Text style={styles.title}>Trillingo</Text>
      </View>
      <TouchableOpacity style={styles.profile} onPress={() => setOpen(true)}>
        <Ionicons name="person-circle" size={30} color={colors.textPrimary} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade">
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Text style={styles.menuHeader}>{user?.username || 'Guest'}</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setOpen(false); onUpdateProfile && onUpdateProfile(); }}>
              <Ionicons name="pencil" size={18} color={colors.textPrimary} />
              <Text style={styles.menuText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={18} color={colors.secondary} />
              <Text style={[styles.menuText, { color: colors.secondary }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  title: { marginLeft: spacing.sm, fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  profile: { padding: spacing.sm },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  menu: { backgroundColor: colors.surface, marginTop: 60, marginRight: spacing.lg, borderRadius: radii.md, padding: spacing.md, width: 200, ...shadow.card },
  menuHeader: { fontWeight: '700', marginBottom: spacing.sm, color: colors.textPrimary },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuText: { marginLeft: spacing.sm, color: colors.textPrimary, fontWeight: '600' },
});

export default TopBar;


