# tours-frontend

# Android release
Need to apply this patch: https://github.com/airbnb/react-native-maps/pull/1643/commits/874cb0411ad55370c23ea205cbcf530f7f990a5a

# Submitting a codepush update
Docs: http://microsoft.github.io/code-push/docs/react-native.html

Sign in with Github, user: uclastudentmedia

```
code-push release-react UCLAMaps-Android android
code-push promote UCLAMaps-Android Staging Production

code-push release-react UCLAMaps-iOS ios
code-push promote UCLAMaps-iOS Staging Production
```
