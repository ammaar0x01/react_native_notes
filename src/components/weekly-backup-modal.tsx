import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { recordBackupTimestamp } from '@/utils/dataExport';

const COLORS = {
  bgOverlay: 'rgba(0, 0, 0, 0.72)',
  surface: '#1A1D24',
  surfaceElevated: '#242832',
  border: '#2E3340',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  accent: '#F59E0B',
  accentText: '#111827',
};

type WeeklyBackupModalProps = {
  visible: boolean;
  onClose: () => void;
  onDownloadBackup: () => Promise<void> | void;
};

export default function WeeklyBackupModal({
  visible,
  onClose,
  onDownloadBackup,
}: WeeklyBackupModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsExporting(true);
      await onDownloadBackup();
      await recordBackupTimestamp();
      onClose();
    } catch (error) {
      console.error('Backup download failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconBadge}>
            <Ionicons name="cloud-download-outline" size={26} color={COLORS.accent} />
          </View>

          <Text style={styles.title}>Weekly Backup Reminder</Text>
          <Text style={styles.description}>
            It has been over 7 days since your last backup. Download a fresh JSON backup now to keep your notes, tasks, and links safe.
          </Text>

          <View style={styles.actionsRow}>
            <Pressable
              style={styles.laterButton}
              onPress={onClose}
              disabled={isExporting}
            >
              <Text style={styles.laterButtonText}>Later</Text>
            </Pressable>

            <Pressable
              style={[styles.downloadButton, isExporting && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color={COLORS.accentText} />
              ) : (
                <>
                  <Ionicons
                    name="download-outline"
                    size={16}
                    color={COLORS.accentText}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.downloadButtonText}>Download JSON</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.bgOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  laterButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  downloadButton: {
    flex: 1.4,
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: COLORS.accentText,
    fontWeight: '800',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
