import { ReadStream, WriteStream } from "node:tty";
import { max, repeat } from "./utils";
import * as readline from "readline";
import 'colors'

const chars = {
  clear: "\x1Bc",
};

type ConsoleMenuStrategy = (view: DrawMenuData) => void;

interface DrawMenuData {
  title: string;
  list: string[];
  select: number;
  page: number;
  len: number;
  pages: number;
  last: number;
}

function format(data) { return data }

const linesStrategy: ConsoleMenuStrategy = ({ title, list, select, page, len, pages, last }) => {
  const width = max([ ...list, title ]) + 10;
  const pagination = '\u2524' + (page + 1) + '/' + pages + '\u251C';
  const fill = width - title.length - pagination.length;
  const selectIndex = page * len + select;
  const isLast = page === pages - 1;
  const pageLen = isLast ? last + 1 : len;

  console.log(
    '\u250C\u2500' +
      (' ' + title + ' ').bgWhite.black +
      repeat('\u2500', fill - 4) +
      pagination +
      '\u2500\u2510'
  );

  for (let i = 0; i < pageLen; i++) {
    let index = page * len + i;
    if (index === selectIndex) {
      console.log('\u2502' + format(list[index].padEnd(width)).bgCyan + '\u2502');
    } else {
      console.log('\u2502' + format(list[index].padEnd(width)) + '\u2502');
    }
  }

  if (isLast) {
    let remain = len - last - 1;
    for (let i = 0; i < remain; i++) {
      console.log('\u2502' + ''.padEnd(width) + '\u2502');
    }
  }

  console.log('\u2514' + repeat('\u2500', width) + '\u2518');
}

class MenuControl {
  private title: string;
  private list: string[];
  private select: number;
  private page: number;
  private len: number;
  private pages: number;
  private last: number;
  
  constructor(
    title: string,
    list: string[],
    colums: number,
    rows: number
  ) {
    this.title = title
    this.list = list
    this.len = rows - 2;
    this.last = list.length % this.len - 1;
	  this.pages = Math.floor(list.length / this.len + 1);
    this.select = 0;
    this.page = 0;
  }
    
  get viewData(): DrawMenuData {
    return {
      title: this.title,
      list: this.list,
      select: this.select,
      page: this.page,
      len: this.len,
      pages: this.pages,
      last: this.last
    }
  }

  get result(): number {
    return this.page * this.len + this.select;
  }

  prevPage() {
    if (this.page !== 0) {
      this.page--;
    } else {
      this.page = this.pages - 1;
    }
    this.select = 0;
  }

  nextPage() {
    if (this.page !== this.pages - 1) {
      this.page++;
    } else {
      this.page = 0;
    }
    this.select = 0;
  }

  prevLine() {
    if (this.select !== 0) {
      this.select--;
    } else if (this.page === this.pages - 1) {
      this.select = this.last;
    } else {
      this.select = this.len - 1;
    }
  }

  nextLine() {
    if (this.page !== this.pages - 1) {
      if (this.select !== this.len - 1) {
        this.select++;
      } else {
        this.select = 0;
      }
    } else {
      if (this.select !== this.last) {
        this.select++;
      } else {
        this.select = 0;
      }
    }
  }
}

export class ConsoleUI {
  private readonly stdin: ReadStream;
  private readonly stdout: WriteStream;
  private menuStrategy: ConsoleMenuStrategy;
  private menuControl: MenuControl

  constructor(
    stdin: ReadStream,
    stdout: WriteStream
  ) {
    this.stdin = stdin;
    this.stdout = stdout;
    this.menuStrategy = linesStrategy;
  }

  public async question(q: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.stdout.write(q);
      this.stdin.once("data", (data) => resolve(String(data).trim()));
    });
  }

  public setTitle(title: string) {
    if (process.platform === "win32") {
      process.title = title;
    } else {
      this.stdout.write("\x1b]2;" + title + "\x1b\x5c");
    }
  }

  public async menu(title: string = "No name", list: string[]): Promise<number> {
    this.menuControl = new MenuControl(
      title,
      list,
      this.stdout.columns,
      this.stdout.rows - 2
    )

    return new Promise((resolve, reject) => {
      readline.emitKeypressEvents(this.stdin);
      this.stdin.setRawMode(true);

      this.drawMenu();

      this.stdin.on("keypress", (ch, key) => {
        const result = this.onKey(key)
        if (result) resolve(result)
      });
    });
  }

  private onKey(key): number | null {
    if (key.name === "return") {
      this.clear()
      this.stdin.removeAllListeners("keypress");
      this.stdin.setRawMode(false);
      const result = this.menuControl.result
      delete this.menuControl
      return result;
    } else if (key.sequence === "\u0003") {
      this.clear()
      process.exit()
    } else {
      this.onMoveKey(key)
      this.drawMenu()
      return null
    }
  }

  private onMoveKey(key) {
    if (key.name === "down") {
      this.menuControl.nextLine()
    } else if (key.name === "up") {
      this.menuControl.prevLine()
    } else if (key.name === "right") {
      this.menuControl.nextPage()
    } else if (key.name === "left") {
      this.menuControl.prevPage()
    }
  }

  private drawMenu() {
    this.clear();
    this.menuStrategy(this.menuControl.viewData);
  }

  private clear() {
    this.stdout.write(chars.clear);
  }
}
