# komunity
누구나 쉽게 따라할 수 있는 graphql, express, mongodb 스택의 커뮤니티 백엔드 예제

### 설치
````bash
git clone https://github.com/olivyou2/komunity.git
cd komunity
npm install
````

### 실행
````bash
npm start
````

### 테스트 실행
````bash
npm test
````

### 환경변수
````bash
# Port Number
export PORT=80

# MongoDB URL
export MONGODB_URL=mongodb://localhost

# JWT SecretKey
export SECRET_KEY=asdfasdf
````

### 도커빌드
````bash
docker build -t komunity .'
# Docker 인스턴스의 진입점은 index.js 로, 환경변수를 설정해줘야 합니다!
````

### Stack
<div style="display:flex;">
<img src="https://img.shields.io/badge/node-339933?style=for-the-badge&logo=javascript&logoColor=white"> 
<img src="https://img.shields.io/badge/mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> 
<img src="https://img.shields.io/badge/graphql-E10098?style=for-the-badge&logo=graphql&logoColor=white">  
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> 
  </div>
