"""A tiny greeting helper — the kind of real, tested source you'd pull a snippet from."""

import os

DEFAULT_NAME = "world"


class Greeter:
    def __init__(self, name: str = DEFAULT_NAME) -> None:
        self.name = name

    # :snippet-start: greet
    def greet(self) -> str:
        """Return a friendly greeting."""
        return f"Hello, {self.name}!"
    # :snippet-end:


if __name__ == "__main__":
    print(Greeter(os.environ.get("GREET_NAME", DEFAULT_NAME)).greet())
