# app-pneu
Aplicativo de movimentação de pneus do sistema de frota


# generate keystore
cd C:\Program Files\Java\jdk-11.0.12\bin
keytool -genkeypair -alias release.keystore-alias -keyalg RSA -keysize 2048 -validity 9125 -keystore release.keystore
keytool -export -rfc -alias release.keystore-alias -file upload_certificate.pem -keystore release.keystore

@nexoQwerty123
CN = Anexo Tecnologia
OU = Anexo Tecnologia
O = Anexo Tecnologia
L = Gravatai
S = RS
C = BR

# generate apk
Generating the release AAB#
cd android
./gradlew bundleRelease

caso não funcione testar
./gradlew bundleRelease -x bundleReleaseJsAndAssets

Generating the release APK#
./gradlew assembleRelease 

# mac - ajustes
chmod 755 android/gradlew 

# ajustes 
Error: Cannot find module './env'
Correção executar o comando no repositório:
npm run env -- prod

github.com/RepairShopr/react-native-signature-capture/pull/179/commits/1d856ec243999d2cec4c00f10c050e6d014c2475
import java.util.UUID;

// set the file name of your choice
UUID uuid = UUID.randomUUID();
String uuidStr = uuid.toString();
String fname = uuidStr + "-signature.png";

https://stackoverflow.com/questions/72755476/invariant-violation-viewproptypes-has-been-removed-from-react-native-migrate-t

// Deprecated Prop Types
  get ColorPropType(): $FlowFixMe {
    return require("deprecated-react-native-prop-types").ColorPropType
  },
  get EdgeInsetsPropType(): $FlowFixMe {
    return require("deprecated-react-native-prop-types").EdgeInsetsPropType
  },
  get PointPropType(): $FlowFixMe {
    return require("deprecated-react-native-prop-types").PointPropType
  },
  get ViewPropTypes(): $FlowFixMe {
    return require("deprecated-react-native-prop-types").ViewPropTypes
  },

https://github.com/dotintent/react-native-ble-plx/issues/492
node_modules/react-native-video/react-native-video.podspec
s.swift_version = "5.0"

https://stackoverflow.com/questions/71030835/m1-mac-react-native-ios-build-error-in-target-rct-folly-from-project-pods
commenting out the line typedef uint8_t clockid_t; in Time.h

# Gerar versão

Alterar a versão no arquivo android/app/build.gradle
linhas 145 e 146
  versionCode 2
  versionName "1.2"

Gerar arquivo AAB conforme README

após gerado o arquivo ele será colocado na Google Play Console
https://play.google.com/console/u/0/signup

entrar com a conta da anexotecnologia@gmail.com

aparecerão todos os app da anexo, selecione o app desejado

selecionar na aba lateral esquerda a opção Produção com icone de foguete

clicar no botão Criar nova versão no canto superior direito

anexar o arquivo AAB do app

o site irá montar o nome da versão, deixar apenas o que estiver dentro do parentese, 
ex: 2 (1.2) ficará apenas 1.2 

depois clique em Avaliar versão no final da tela.

confirmar as telas seguintes e ao final mostrará as versões do app e a nova como em análise

pronto, só aguardar a play store disponibilizar em produção.