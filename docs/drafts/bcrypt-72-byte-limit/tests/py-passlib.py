from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd_context.hash("correct horse battery staple")  # ValueError with bcrypt 5.0
