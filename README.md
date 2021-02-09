# telnet-my

-----

My client for enter to devices

## Установка

### Windows

1) Установить Node.js и npm

    https://nodejs.org/uk/download/

2) Установить зависимости

```bash
npm install
```

3) Запускаем с директории скрипта
```bash
node index.js
```

### Linux

1) Распаковываем в домашнюю директорию
   
```
~/telnet-my
```

2) Установить Node.js и npm

```bash
sudo apt install nodejs npm
```

3) Установить зависимости

```bash
sudo npm install
```

4) Добавляем алиас

```bash
sudo echo 'alias mytelnet="bash $PWD/run.sh"' >> ~/.bashrc
. ~/.bashrc
```

5) Запускаем отовсюду

```bash
mytelnet
```

Або устанавливаем с помощью скрипта, но также распаковываем в домашнюю директорию

```bash
sudo ./install.sh
```