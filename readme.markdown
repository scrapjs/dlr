# RIP soundcloud downloader
dlr is a scd replacement on osx since soundcloud downloader stopped working last week.

you need electron-prebuilt and set your npm ABI to 51 like:

```bash
npm rebuild --runtime=electron --target=1.4.12 --disturl=https://atom.io/download/atom-shell --abi=51
``` 