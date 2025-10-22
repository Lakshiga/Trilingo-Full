import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  SegmentedButtons,
} from 'react-native-paper';
import BrandHeader from '../../components/BrandHeader';
import { colors, radii, spacing, shadow } from '../../theme/designSystem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, LanguageCode } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuth();
  const { getText, getSupportedLanguages } = useLanguage();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode>('en');
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('ta');

  const supportedLanguages = getSupportedLanguages();

  const handleRegister = async () => {
    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert(
        getText({ ta: 'பிழை', en: 'Error', si: 'දෝෂය' }),
        getText({ 
          ta: 'அனைத்து புலங்களும் தேவை', 
          en: 'All fields are required', 
          si: 'සියලු ක්ෂේත්‍ර අවශ්‍යයි' 
        })
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        getText({ ta: 'பிழை', en: 'Error', si: 'දෝෂය' }),
        getText({ 
          ta: 'கடவுச்சொற்கள் பொருந்தவில்லை', 
          en: 'Passwords do not match', 
          si: 'මුරපද නොගැලපේ' 
        })
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        getText({ ta: 'பிழை', en: 'Error', si: 'දෝෂය' }),
        getText({ 
          ta: 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்', 
          en: 'Password must be at least 6 characters', 
          si: 'මුරපදය අවම වශයෙන් අකුරු 6ක් විය යුතුය' 
        })
      );
      return;
    }

    if (nativeLanguage === targetLanguage) {
      Alert.alert(
        getText({ ta: 'பிழை', en: 'Error', si: 'දෝෂය' }),
        getText({ 
          ta: 'தாய்மொழி மற்றும் கற்றல் மொழி வேறுபட்டதாக இருக்க வேண்டும்', 
          en: 'Native language and target language must be different', 
          si: 'මව් භාෂාව සහ ඉලක්ක භාෂාව වෙනස් විය යුතුය' 
        })
      );
      return;
    }

    try {
      const success = await register({
        username: username.trim(),
        email: email.trim(),
        password,
        nativeLanguage,
        targetLanguage,
      });

      if (success) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert(
          getText({ ta: 'பதிவு தோல்வி', en: 'Registration Failed', si: 'ලියාපදිංචියට අසමත්' }),
          getText({ 
            ta: 'பயனர் பதிவு செய்ய முடியவில்லை', 
            en: 'Unable to register user', 
            si: 'පරිශීලකයා ලියාපදිංචි කළ නොහැක' 
          })
        );
      }
    } catch (error) {
      Alert.alert(
        getText({ ta: 'பிழை', en: 'Error', si: 'දෝෂය' }),
        getText({ 
          ta: 'பதிவு செய்ய முடியவில்லை', 
          en: 'Unable to register', 
          si: 'ලියාපදිංචි කළ නොහැක' 
        })
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BrandHeader title={getText({ ta: 'ட்ரில்லிங்கோ', en: 'Trillingo', si: 'ට්‍රිලින්ගෝ' })}
            subtitle={getText({ ta: 'புதிய கணக்கு உருவாக்கவும்', en: 'Create New Account', si: 'නව ගිණුමක් සාදන්න' })}
          />

          <Card style={styles.registerCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>
                {getText({ ta: 'பதிவு', en: 'Register', si: 'ලියාපදිංචි කරන්න' })}
              </Title>

              <TextInput
                label={getText({ ta: 'பயனர்பெயர்', en: 'Username', si: 'පරිශීලක නාමය' })}
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                label={getText({ ta: 'மின்னஞ்சல்', en: 'Email', si: 'විද්‍යුත් තැපෑල' })}
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                label={getText({ ta: 'கடவுச்சொல்', en: 'Password', si: 'මුරපදය' })}
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                label={getText({ ta: 'கடவுச்சொல் உறுதிப்படுத்தவும்', en: 'Confirm Password', si: 'මුරපදය තහවුරු කරන්න' })}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Paragraph style={styles.sectionTitle}>
                {getText({ ta: 'தாய்மொழி', en: 'Native Language', si: 'මව් භාෂාව' })}
              </Paragraph>
              <SegmentedButtons
                value={nativeLanguage}
                onValueChange={(value) => setNativeLanguage(value as LanguageCode)}
                buttons={supportedLanguages.map(lang => ({
                  value: lang.code,
                  label: lang.nativeName,
                }))}
                style={styles.segmentedButtons}
              />

              <Paragraph style={styles.sectionTitle}>
                {getText({ ta: 'கற்றல் மொழி', en: 'Target Language', si: 'ඉලක්ක භාෂාව' })}
              </Paragraph>
              <SegmentedButtons
                value={targetLanguage}
                onValueChange={(value) => setTargetLanguage(value as LanguageCode)}
                buttons={supportedLanguages.map(lang => ({
                  value: lang.code,
                  label: lang.nativeName,
                }))}
                style={styles.segmentedButtons}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.registerButton}
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  getText({ ta: 'பதிவு', en: 'Register', si: 'ලියාපදිංචි කරන්න' })
                )}
              </Button>

              <Button
                mode="text"
                onPress={handleBackToLogin}
                style={styles.loginButton}
              >
                {getText({ 
                  ta: 'ஏற்கனவே கணக்கு உள்ளதா?', 
                  en: 'Already have an account?', 
                  si: 'දැනටමත් ගිණුමක් තිබේද?' 
                })}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  registerCard: {
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
  },
  input: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 16,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: spacing.md,
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: 10,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
});

export default RegisterScreen;
