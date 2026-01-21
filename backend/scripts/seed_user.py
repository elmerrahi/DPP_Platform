import argparse
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.security import get_password_hash
from app.db import models
from app.db.session import SessionLocal


def seed_user(name: str, email: str, password: str) -> None:
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == email).first()
        if existing:
            existing.name = name
            existing.hashed_password = get_password_hash(password)
            db.commit()
            print(f"Updated existing user: {email}")
            return

        user = models.User(
            name=name,
            email=email,
            hashed_password=get_password_hash(password),
        )
        db.add(user)
        db.commit()
        print(f"Created user: {email}")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed a test user for the DPP platform.")
    parser.add_argument("--name", default="Test User")
    parser.add_argument("--email", default="test@test")
    parser.add_argument("--password", default="test1234")
    args = parser.parse_args()
    seed_user(args.name, args.email, args.password)


if __name__ == "__main__":
    main()