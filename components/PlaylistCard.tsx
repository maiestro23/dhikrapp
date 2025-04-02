import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, SkipBack, SkipForward } from 'lucide-react-native';

type PlaylistCardProps = {
  title: string;
  count: number;
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
  progress: number;
};

export function PlaylistCard({
  title,
  count,
  primaryText,
  secondaryText,
  tertiaryText,
  progress,
}: PlaylistCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{count} dhikrs</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.primaryText}>{primaryText}</Text>
        <Text style={styles.secondaryText}>{secondaryText}</Text>
        <Text style={styles.secondaryText}>{tertiaryText}</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.controlButton}>
            <SkipBack color="#8E1A3B" size={24} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.playButton}>
            <Play color="#FFFFFF" size={24} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <SkipForward color="#8E1A3B" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Serif',
    fontSize: 18,
    color: '#1A1A1A',
  },
  count: {
    fontFamily: 'Sans',
    fontSize: 14,
    color: '#666666',
  },
  content: {
    marginBottom: 24,
  },
  primaryText: {
    fontFamily: 'Serif',
    fontSize: 20,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  secondaryText: {
    fontFamily: 'Sans',
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  controls: {
    gap: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8E1A3B',
    borderRadius: 2,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: '#8E1A3B',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});