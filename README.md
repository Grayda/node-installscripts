# node-installscripts

This repo contains one-line install scripts for installing Node.js in a Linux environment. It's based on [node-pi-zero](https://github.com/grayda/node-pi-zero) which is forked from [this repo](https://github.com/sdesalas/node-pi-zero)

Each command is re-runnable, meaning you can upgrade and downgrade versions of Node easily.

## How to use

Open the README file that corresponds to your architecture (e.g. `README-armv6l.md` for Raspberry Pi Zero) and look for the version of node you wish to install. Open a terminal and copy & paste the command in. Node will be installed, and you can confirm this by running `node -v` and `npm -v`.

Should you need to reinstall, upgrade or downgrade, you can simply run these commands again.

## Contributing

If a version of node you're after isn't listed here, you can add it like so:

1. Make sure you've got node installed
2. Fork this repo, then clone your fork
3. Install `gulp` with `npm install -g gulp`
4. Run `gulp generate`
5. Commit your changes, then open a PR.

## A word about security

You should always be careful when running bash scripts obtained by wget! Be sure to view the source of the script before executing it!
