from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Company(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "companies"

    name: Mapped[str] = mapped_column(String(200))
    industry: Mapped[str | None] = mapped_column(String(100))
    website: Mapped[str | None] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(String)

    users: Mapped[list["User"]] = relationship(back_populates="company")
    brands: Mapped[list["Brand"]] = relationship(back_populates="company")
    keywords: Mapped[list["Keyword"]] = relationship(back_populates="company")
    competitors: Mapped[list["Competitor"]] = relationship(back_populates="company")
    contents: Mapped[list["Content"]] = relationship(back_populates="company")
    documents: Mapped[list["Document"]] = relationship(back_populates="company")
    reports: Mapped[list["Report"]] = relationship(back_populates="company")
