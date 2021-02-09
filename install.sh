#!/bin/bash

sudo apt update
sudo apt install nodejs npm

sudo npm install

sudo echo 'alias mytelnet="bash ~/telnet-my/run.sh"' >> ~/.bashrc
. ~/.bashrc
