import pytest

from app.services.text_extraction import UnsupportedFileTypeError, extract_text


def test_extracts_plain_text_file():
    content = "佰利新材企业简介".encode("utf-8")
    assert extract_text("intro.txt", content) == "佰利新材企业简介"


def test_rejects_unsupported_extension():
    with pytest.raises(UnsupportedFileTypeError):
        extract_text("archive.zip", b"not really a zip")


def test_rejects_file_with_no_extension():
    with pytest.raises(UnsupportedFileTypeError):
        extract_text("noextension", b"data")
