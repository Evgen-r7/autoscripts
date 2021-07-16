set version=v6.3.1.70
cd C:/de%version%

git clone https://github.com/ONLYOFFICE/build_tools.git 
cd build_tools
git checkout %version%

cd ..

git clone https://github.com/ONLYOFFICE/core.git
cd core
git checkout %version%

cd ..

git clone https://github.com/ONLYOFFICE/desktop-apps.git
cd desktop-apps
git checkout %version%

cd ..

git clone https://github.com/ONLYOFFICE/desktop-sdk.git
cd desktop-sdk
git checkout %version%

cd ..

git clone https://github.com/ONLYOFFICE/dictionaries.git
cd dictionaries
git checkout %version%

cd ..

git clone https://github.com/ONLYOFFICE/sdkjs.git
cd sdkjs
git checkout %version%

cd ..

git clone https://github.com/ONLYOFFICE/web-apps.git
cd web-apps
git checkout %version%

cd ..

git clone https://github.com/ASC-OFFICE/r7
cd r7
git checkout %version%

cd ..

git clone https://github.com/ONLYOFFICE/sdkjs-plugins.git
cd sdkjs-plugins
git checkout %version%

cd ..
