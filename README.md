# Matrix Font Editor

The Matrix Font Editor was built for the purpose of creating and editing
8-bit variable-width fonts through a simple GUI.
It outputs the fonts in a JSON format with a C hex notation, e.g. `["0xBF"]`.

The editor stores the font in window.localStorage and provides the ability to
upload and download an entire font.

## Use

Head [over here](https://matrix-font-editor.netlify.app/) and start editing.
A template font is provided, with an example subset of characters.

## FAQ

> Does the editor feature a testing area?

Yes, just below the active glyph output. You can even type your own text.

> What did you need this for?

I have been working on an IoT device that uses LED matrix display for presenting
messages to the user. I found most of the available matrix fonts lacking certain
features and decided to create my own custom font. Because of the frequent
changes to the font, the otherwise cumbersone process needed to be streamlined
and so this project sprang into existence.

> Can I see this device that you've mentioned?

Sure, take [a sneak peek](https://time-tome-tester.netlify.app/).

## License

Copyright (c) Matej Korlaet. Distributed under the GNU General Public License v3.0.