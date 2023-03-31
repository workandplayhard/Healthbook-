import React from 'react';

import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon, useColorMode } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddPersonScreen from 'screens/home/profile/caring-circle/add-person-screen/AddPersonScreen';
import EditPersonScreen from 'screens/home/profile/caring-circle/add-person-screen/EditPersonScreen';
import CaringCircleScreen from 'screens/home/profile/caring-circle/caring-circle-screen/CaringCircleScreen';

import { useAuthStore } from '@hooks/useAuthStore';
import CodeRetrievalScreen from '@screens//access/code-retrieval-screen/CodeRetrievalScreen';
import EnterAccessScreen from '@screens//access/enter-access-screen/EnterAccessScreen';
import ForgotPasswordScreen from '@screens//authentication/forgot-password-screen/ForgotPasswordScreen';
import SignInScreen from '@screens//authentication/sign-in-screen/SignInScreen';
import WaitScreen from '@screens//chat/wait-screen/WaitScreen';
import AccountInfoScreen from '@screens//home/profile/account-info-screen/AccountInfoScreen';
import MyProfileScreen from '@screens//home/profile/my-profile-screen/MyProfileScreen';
import SecuritySettings from '@screens//home/security-settings/SecuritySettings';
import CategoryScreen from '@screens//records/records-screen/CategoryScreen';
import CreateAccountScreen from '@screens/access/create-account-screen/CreateAccountScreen';
import ThankYouScreen from '@screens/access/thank-you-screen/ThankYouScreen';
import HealthHelpScreen from '@screens/health-help/HealthHelpScreen';
import ConnectDeviceScreen from '@screens/home/dashboard-screen/ConnectDevice';
import DashboardSettingsScreen from '@screens/home/dashboard-settings-screen/DashboardSettingsScreen';
import ConnectedHealthScreen from '@screens/home/profile/connected-health-screen/ConnectedHealthScreen';
import AccessDocumentScreen from '@screens/home/profile/health-vault-screen/AccessDocumentScreen';
import Viewer from '@screens/home/profile/health-vault-screen/components/Viewer';
import EditDocumentScreen from '@screens/home/profile/health-vault-screen/EditDocumentScreen';
import HealthVaultScreen from '@screens/home/profile/health-vault-screen/HealthVaultScreen';
import SharingProcessScreen from '@screens/home/profile/health-vault-screen/SharingProcessScreen';
import UploadDocumentTagScreen from '@screens/home/profile/health-vault-screen/UploadDocumentTagScreen';
import SupportScreen from '@screens/home/profile/support-screen/SupportScreen';
import QuestionnaireScreen from '@screens/home/questionnaire/QuestionnaireScreen';
import AddAllergyScreen from '@screens/records/allergy-screen/AddAllergyScreen';
import EditAllergyScreen from '@screens/records/allergy-screen/EditAllergyScreen';
import AddConditionScreen from '@screens/records/condition/AddConditionScreen';
import EditConditionScreen from '@screens/records/condition/EditConditionScreen';
import ExportPDFScreen from '@screens/records/export-records-screen/ExportPDFScreen';
import AddFamilyHistoryScreen from '@screens/records/family-history/AddFamilyHistoryScreen';
import EditFamilyHistoryScreen from '@screens/records/family-history/EditFamilyHistoryScreen';
import AddHealthcareVisitsScreen from '@screens/records/healthcare-visits/AddHealthcareVisitsScreen';
import EditHealthcareVisitsScreen from '@screens/records/healthcare-visits/EditHealthcareVisitsScreen';
import ImageUploadScreen from '@screens/records/image-uploads-screen/ImageUploadScreen';
import AddImmunizationScreen from '@screens/records/immunization/AddImmunizationScreen';
import EditImmunizationScreen from '@screens/records/immunization/EditImmunizationScreen';
import AddLabScreen from '@screens/records/lab/AddLabScreen';
import EditLabScreen from '@screens/records/lab/EditLabScreen';
import LabScreen from '@screens/records/lab/LabScreen';
import AddMedicationScreen from '@screens/records/medication/AddMedicationScreen';
import EditMedicationScreen from '@screens/records/medication/EditMedicationScreen';
import AddProcedureScreen from '@screens/records/procedure/AddProcedureScreen';
import EditProcedureScreen from '@screens/records/procedure/EditProcedureScreen';
import VerifySenderBirthdayScreen from '@screens/records/records-screen/VerifySenderBirthdayScreen';
import AddSocialHabbitScreen from '@screens/records/social-habit/AddSocialHabbitScreen';
import EditSocialHabbitScreen from '@screens/records/social-habit/EditSocialHabbitScreen';
import AddSurgeryScreen from '@screens/records/surgeries/AddSurgeryScreen';
import BodyPartListScreen from '@screens/records/surgeries/BodyPartListScreen';
import EditSurgeryScreen from '@screens/records/surgeries/EditSurgeryScreen';
import AddTravelHistoryScreen from '@screens/records/travel-history-screen/AddTravelHistoryScreen';
import EditTravelHistoryScreen from '@screens/records/travel-history-screen/EditTravelHistoryScreen';
import TravelHistoryScreen from '@screens/records/travel-history-screen/TravelHistoryScreen';
import SymptomsQuestionnaireScreen from '@screens/symptom-checker/component/SymptomsQuestionnaireScreen';
import AddSymptomScreen from '@screens/symptoms/symptoms-screen/AddSymptomsScreen';
import EditSymptomScreen from '@screens/symptoms/symptoms-screen/EditSymptomScreen';
import WelcomeScreen from '@screens/welcome/welcome-screen/WelcomeScreen';
import Header from '@screens/components/Header';
import ProfileMenuScreen from '@screens/profile-menu-screen/ProfileMenuScreen';
import MyCalendarScreen from '@screens/home/my-calendar-screen/MyCalendarScreen';

import { screenOptions } from './config';
import MainDashboardNavigator from './MainDashboardNavigator';
import TabNavigator from './TabNavigator';
import type { RootStackNavigatorParamList } from './types';

const Stack = createStackNavigator<RootStackNavigatorParamList>();
const RootNavigator = () => {
  const { colorMode } = useColorMode();

  const access = useAuthStore(state => state.access);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions(colorMode)}>
        {access === undefined ? (
          <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                headerShown: false,
                animationTypeForReplace: 'pop',
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                title: 'Password Assistance',
              }}
            />
            <Stack.Screen
              name="EnterAccess"
              component={EnterAccessScreen}
              options={{
                headerShown: true,
                title: 'Access Code',
              }}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
              options={{
                title: 'Create an Account',
              }}
            />
            <Stack.Screen
              name="CodeRetrieval"
              component={CodeRetrievalScreen}
              options={{
                headerShown: true,
                title: 'Resend Access Code',
              }}
            />
            <Stack.Screen
              name="ThankYou"
              component={ThankYouScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="TabNavigator"
              component={TabNavigator}
              options={({ route }) => ({
                header: () => <Header focusedTab={getFocusedRouteNameFromRoute(route)} />,
              })}
            />
            <Stack.Screen name="AccountSettings" component={ProfileMenuScreen} options={{ title: '' }} />
            <Stack.Screen name="MyCalendar" component={MyCalendarScreen} />
            <Stack.Screen
              name="WaitScreen"
              component={WaitScreen}
              options={{
                title: 'Health Chat',
              }}
            />
            <Stack.Screen
              name="MainDashboardNavigator"
              component={MainDashboardNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AccountInfo"
              component={AccountInfoScreen}
              options={{
                title: 'Account Information',
              }}
            />
            <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ title: 'My Profile' }} />
            <Stack.Screen
              name="ConnectDevice"
              component={ConnectDeviceScreen}
              options={{
                headerTitle: '',
                headerBackTitle: 'Close',
                headerBackTitleVisible: true,
                headerBackTitleStyle: { color: 'white' },
                headerBackImage: () => (
                  <Icon ml="4" mr="2" as={<MaterialIcons name="close" />} size="lg" color="white" />
                ),
              }}
            />
            <Stack.Screen
              name="CaringMemberList"
              component={CaringCircleScreen}
              options={{ headerTitle: 'Caring Circle' }}
            />
            <Stack.Screen name="AddPerson" component={AddPersonScreen} options={{ headerTitle: "Person's Details" }} />
            <Stack.Screen
              name="EditPerson"
              component={EditPersonScreen}
              options={{ headerTitle: "Person's Details" }}
            />
            <Stack.Screen name="HealthVault" component={HealthVaultScreen} options={{ title: 'Health Vault' }} />
            <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
            <Stack.Screen
              name="UploadDocumentTagScreen"
              component={UploadDocumentTagScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="EditDocumentScreen" component={EditDocumentScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="AccessDocumentScreen"
              component={AccessDocumentScreen}
              options={{
                headerTitle: '',
                headerBackTitle: 'Close',
                headerBackTitleVisible: true,
                headerBackTitleStyle: { color: 'white' },
                headerBackImage: () => (
                  <Icon ml="4" mr="2" as={<MaterialIcons name="close" />} size="lg" color="white" />
                ),
              }}
            />
            <Stack.Screen
              name="ConnectedHealth"
              component={ConnectedHealthScreen}
              options={{ title: 'Connected Health' }}
            />
            <Stack.Screen name="SharingProcess" component={SharingProcessScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="SecuritySettings"
              component={SecuritySettings}
              options={{ title: 'Security Settings' }}
            />
            <Stack.Screen name="DashboardSettings" component={DashboardSettingsScreen} />
            <Stack.Screen name="ImageUpload" component={ImageUploadScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="AddCondition"
              component={AddConditionScreen}
              options={{ headerTitle: 'Medical Condition' }}
            />
            <Stack.Screen
              name="EditCondition"
              component={EditConditionScreen}
              options={{ headerTitle: 'Medical Condition' }}
            />
            <Stack.Screen name="AddAllergy" component={AddAllergyScreen} options={{ title: 'Allergy' }} />
            <Stack.Screen name="EditAllergy" component={EditAllergyScreen} options={{ headerTitle: 'Allergy' }} />
            <Stack.Screen name="Category" component={CategoryScreen} options={{ title: 'Categories' }} />
            <Stack.Screen name="AddSurgery" component={AddSurgeryScreen} options={{ title: 'Surgery' }} />
            <Stack.Screen name="EditSurgery" component={EditSurgeryScreen} options={{ title: 'Surgery' }} />
            <Stack.Screen name="Lab" component={LabScreen} />
            <Stack.Screen name="AddLab" component={AddLabScreen} options={{ headerTitle: 'Lab' }} />
            <Stack.Screen name="EditLab" component={EditLabScreen} options={{ headerTitle: 'Lab' }} />
            <Stack.Screen
              name="AddMedicalvisit"
              component={AddHealthcareVisitsScreen}
              options={{ headerTitle: 'Healthcare Visit' }}
            />
            <Stack.Screen
              name="EditMedicalvisit"
              component={EditHealthcareVisitsScreen}
              options={{ headerTitle: 'Healthcare Visit' }}
            />
            <Stack.Screen
              name="AddSocialhistory"
              component={AddSocialHabbitScreen}
              options={{ headerTitle: 'Social Habbit' }}
            />
            <Stack.Screen
              name="EditSocialhistory"
              component={EditSocialHabbitScreen}
              options={{ headerTitle: 'Social Habbit' }}
            />
            <Stack.Screen name="AddProcedure" component={AddProcedureScreen} options={{ headerTitle: 'Procedure' }} />
            <Stack.Screen name="EditProcedure" component={EditProcedureScreen} options={{ headerTitle: 'Procedure' }} />
            <Stack.Screen
              name="AddMedication"
              component={AddMedicationScreen}
              options={{ headerTitle: 'Medication' }}
            />
            <Stack.Screen
              name="EditMedication"
              component={EditMedicationScreen}
              options={{ headerTitle: 'Medication' }}
            />
            <Stack.Screen name="BodyParts" component={BodyPartListScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="AddImmunization"
              component={AddImmunizationScreen}
              options={{ headerTitle: 'Immunization' }}
            />
            <Stack.Screen
              name="EditImmunization"
              component={EditImmunizationScreen}
              options={{ headerTitle: 'Immunization' }}
            />
            <Stack.Screen
              name="AddFamilyhistory"
              component={AddFamilyHistoryScreen}
              options={{ headerTitle: 'Family History' }}
            />
            <Stack.Screen
              name="EditFamilyhistory"
              component={EditFamilyHistoryScreen}
              options={{ headerTitle: 'Family History' }}
            />
            <Stack.Screen name="Viewer" component={Viewer} />
            <Stack.Screen name="AddSymptom" component={AddSymptomScreen} options={{ headerTitle: 'Symptom' }} />
            <Stack.Screen name="EditSymptom" component={EditSymptomScreen} options={{ headerTitle: 'Symptom' }} />
            <Stack.Group
              screenOptions={{
                presentation: 'transparentModal',
                headerShown: false,
              }}
            >
              <Stack.Screen name="ExportPDF" component={ExportPDFScreen} options={{ headerTitle: 'Export PDF' }} />
            </Stack.Group>
            <Stack.Screen name="TravelHistory" component={TravelHistoryScreen} />
            <Stack.Screen
              name="AddTravelhistory"
              component={AddTravelHistoryScreen}
              options={{ title: 'Travel History' }}
            />
            <Stack.Screen
              name="EditTravelhistory"
              component={EditTravelHistoryScreen}
              options={{ headerTitle: 'Travel History' }}
            />
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="SymptomsQuestionnaire"
              component={SymptomsQuestionnaireScreen}
              options={{
                headerTitle: '',
                headerBackTitle: 'Close',
                headerBackTitleVisible: true,
                headerBackTitleStyle: { color: 'white' },
                headerBackImage: () => (
                  <Icon ml="4" mr="2" as={<MaterialIcons name="close" />} size="lg" color="white" />
                ),
              }}
            />
            <Stack.Screen
              name="VerifySenderBirthday"
              component={VerifySenderBirthdayScreen}
              options={{
                headerTitle: '',
                headerBackTitle: 'Close',
                headerBackTitleVisible: true,
                headerBackTitleStyle: { color: 'white' },
                headerBackImage: () => (
                  <Icon ml="4" mr="2" as={<MaterialIcons name="close" />} size="lg" color="white" />
                ),
              }}
            />
            <Stack.Screen
              name="Questionnaire"
              component={QuestionnaireScreen}
              options={{
                headerTitle: '',
                headerBackTitle: 'Close',
                headerBackTitleVisible: true,
                headerBackTitleStyle: { color: 'white' },
                headerBackImage: () => (
                  <Icon ml="4" mr="2" as={<MaterialIcons name="close" />} size="lg" color="white" />
                ),
              }}
            />
            <Stack.Screen name="HealthHelp" component={HealthHelpScreen} options={{ headerTitle: 'Health Help' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
