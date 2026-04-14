export type ToolCategory =
  | 'numerical'
  | 'encode'
  | 'text'
  | 'format'
  | 'crypto'
  | 'datetime'
  | 'binary'
  | 'network'
  | 'regex'

export interface Tool {
  id: string
  name: string
  description: string
  implemented?: boolean // 追加
}

export interface Category {
  id: ToolCategory
  name: string
  icon: string
  tools: Tool[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'numerical',
    name: '数値・ビット変換',
    icon: 'Hash',
    tools: [
      { id: 'base-conv', name: '進数変換（2/8/10/16進）', description: '各進数間を相互変換。任意入力を基準に他表現を同期更新', implemented: true },
      { id: 'bit-view', name: 'ビット列表示', description: '数値をビット列（8/16/32/64bit）で表示' },
      { id: 'signed-unsigned', name: '符号付き/なし変換', description: 'signed / unsigned の解釈切替' },
    ],
  },
  {
    id: 'encode',
    name: 'エンコード／デコード',
    icon: 'Code',
    tools: [
      { id: 'base-n', name: 'BaseNエンコード', description: 'Base64 / Base32 / Base58 / Base85 のエンコード／デコード' },
      { id: 'url-enc', name: 'URLエンコード', description: 'URLエンコード／デコード（%エンコード）', implemented: true },
      { id: 'esc-json', name: 'エスケープ変換（JSON）', description: 'JSON文字列のエスケープ／アンエスケープ', implemented: true },
      { id: 'esc-js', name: 'エスケープ変換（JavaScript）', description: 'JS文字列のエスケープ／アンエスケープ' },
      { id: 'esc-html', name: 'エスケープ変換（HTML）', description: 'HTMLエスケープ／アンエスケープ' },
      { id: 'newline', name: '改行コード変換', description: 'LF / CRLF の相互変換' },
    ],
  },
  {
    id: 'text',
    name: '文字・バイト変換',
    icon: 'Type',
    tools: [
      { id: 'unicode', name: 'Unicode変換', description: '文字 ⇄ code point（U+XXXX）、UTF-8/16/32のバイト列表示', implemented: true },
      { id: 'text-hex', name: 'Text ⇄ HEX', description: '文字列 ⇄ バイト列（HEX表示）。エンコーディング指定可能', implemented: true },
      { id: 'char-code', name: '文字コード変換', description: 'UTF-8 ⇄ Shift_JIS など文字コード変換' },
    ],
  },
  {
    id: 'format',
    name: 'フォーマット変換',
    icon: 'FileCode',
    tools: [
      { id: 'json-pretty', name: 'JSON整形', description: 'Pretty Print／圧縮' },
      { id: 'json-yaml-xml', name: 'JSON ⇄ YAML ⇄ XML', description: '各フォーマット間の相互変換' },
      { id: 'url-json', name: 'URLクエリ ⇄ JSON', description: 'クエリ文字列とJSONの相互変換' },
      { id: 'csv-json', name: 'CSV ⇄ JSON', description: 'CSVとJSONの相互変換' },
      { id: 'form-json', name: 'form-urlencoded ⇄ JSON', description: 'application/x-form-urlencoded とJSONの相互変換' },
    ],
  },
  {
    id: 'crypto',
    name: '暗号・ハッシュ',
    icon: 'Lock',
    tools: [
      { id: 'hash', name: 'ハッシュ生成', description: 'MD5 / SHA-1 / SHA-256 / SHA-512' },
      { id: 'hmac', name: 'HMAC生成', description: '各種ハッシュアルゴリズムによるHMAC生成' },
      { id: 'aes', name: 'AES暗号化', description: 'AES暗号化／復号（モード指定含む）' },
      { id: 'rsa', name: 'RSA暗号化', description: 'RSA暗号化／復号' },
      { id: 'jwt', name: 'JWT解析', description: 'JWTのデコードおよび検証' },
    ],
  },
  {
    id: 'datetime',
    name: '日付・時間',
    icon: 'Clock',
    tools: [
      { id: 'unix-time', name: 'UNIXタイム変換', description: 'UNIXタイム ⇄ 日時（UTC/JSTなど）' },
      { id: 'iso8601', name: 'ISO8601変換', description: 'ISO8601形式と日時の相互変換' },
      { id: 'timezone', name: 'タイムゾーン変換', description: '各タイムゾーン間の日時変換' },
    ],
  },
  {
    id: 'binary',
    name: 'バイナリ／構造解析',
    icon: 'Binary',
    tools: [
      { id: 'hex-dump', name: 'HEXダンプ', description: 'バイト列をHEX + ASCIIで表示' },
      { id: 'base64-hex', name: 'Base64→HEX変換', description: 'Base64デコード後にHEX表示' },
      { id: 'tlv-ber-der', name: 'TLV / BER / DER解析', description: 'ASN.1構造のデコード表示' },
      { id: 'binary-struct', name: 'バイナリ構造体解析', description: '任意フォーマットの構造解析（簡易）' },
    ],
  },
  {
    id: 'network',
    name: 'ネットワーク・Web系',
    icon: 'Globe',
    tools: [
      { id: 'http-header', name: 'HTTPヘッダパース', description: 'HTTPヘッダ文字列を構造化表示' },
      { id: 'cookie-parse', name: 'Cookieパース', description: 'Cookie属性（SameSite等）を分解' },
      { id: 'mime-type', name: 'MIMEタイプ解析', description: 'Content-Typeの解析' },
      { id: 'ip-conv', name: 'IPアドレス変換', description: '整数 ⇄ IPv4表記の相互変換' },
    ],
  },
  {
    id: 'regex',
    name: '正規表現・テキスト処理',
    icon: 'Search',
    tools: [
      { id: 'regex-test', name: '正規表現テスト', description: '入力テキストに対するマッチ結果表示' },
      { id: 'diff', name: '差分比較（diff）', description: '2テキスト間の差分表示' },
      { id: 'invisible-char', name: '改行・空白可視化', description: '不可視文字の可視化' },
    ],
  },
]
