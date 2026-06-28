<div align="center">

# Original Card Studio

### オリジナルのコレクションカードを、ブラウザでデザイン。

名前・属性・技・画像を組み合わせて、オリジナルカードをリアルタイムに作成できるWebアプリです。<br>
完成したカードは、画面で見たままのデザインを高解像度PNGとして保存できます。

[![React](https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react&logoColor=61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-GPL--3.0-c65d48?style=flat-square)](./LICENSE)

</div>

![Original Card Studioのトップページ](docs/assets/app-overview.png)

## Live Demo

[Original Card Studioを開く](https://yuhara-4113-ai.github.io/original-poke-card-generator/)

## Features

| | 機能 | 内容 |
|:--:|---|---|
| ✦ | **リアルタイムプレビュー** | 入力内容を即座にカードへ反映します |
| ◈ | **18種類の属性テーマ** | 属性ごとに配色・アイコン・雰囲気が変化します |
| ✧ | **インタラクティブな光沢** | ポインターの位置に合わせてカードの光沢が動きます |
| ↑ | **画像アップロード** | JPG・PNG・WebPをブラウザ内で安全に扱います |
| ↓ | **高解像度PNG出力** | プレビューと同じ内容を1320 × 1842 pxで保存します |
| 文 | **日本語・英語対応** | UIをいつでも切り替えられます |
| ◐ | **レスポンシブ対応** | デスクトップからモバイルまで快適に操作できます |

## Sample Cards

<table>
  <tr>
    <th>Blazemon</th>
    <th>Aquaflow</th>
    <th>Thunderstrike</th>
  </tr>
  <tr>
    <td><img src="docs/assets/sample-blazemon.png" alt="Blazemonのサンプルカード" /></td>
    <td><img src="docs/assets/sample-aquaflow.png" alt="Aquaflowのサンプルカード" /></td>
    <td><img src="docs/assets/sample-thunderstrike.png" alt="Thunderstrikeのサンプルカード" /></td>
  </tr>
  <tr>
    <td align="center">Fire</td>
    <td align="center">Water</td>
    <td align="center">Electric</td>
  </tr>
</table>

## Quick Start

### Requirements

- Node.js `20.19+` または `22.12+`
- npm

### Setup

```bash
git clone https://github.com/yuhara-4113-ai/original-poke-card-generator.git
cd original-poke-card-generator
npm install
npm run dev
```

起動後、ブラウザで [http://localhost:5173](http://localhost:5173) を開いてください。

## How to Use

1. サンプルカードを選ぶか、名前・HP・属性を入力します。
2. オリジナル画像、技、ダメージ、説明文を設定します。
3. 右側のプレビューで仕上がりを確認します。
4. **高解像度PNGをダウンロード**から画像を保存します。

アップロードした画像はサーバーへ送信されず、ブラウザ内だけで処理されます。

## Design & Architecture

プレビューとPNG出力は、どちらも同じSVGレンダラーを利用しています。表示用と保存用の実装を分けないことで、ダウンロード後にレイアウトや文字位置が変わる問題を防いでいます。

```text
Form Input ──> Card Data ──> Shared SVG Renderer ──┬──> Live Preview
                                                    └──> 2x PNG Export
```

### Tech Stack

| Category | Technology |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Card rendering | SVG / Canvas API |
| Styling | CSS |
| Internationalization | React Context |

## Scripts

```bash
npm run dev      # 開発サーバー
npm run build    # 本番ビルド
npm run preview  # ビルド結果の確認
npm run lint     # ESLint
```

## Deployment

このサイトはGitHub Pagesで公開しています。`main`ブランチへのpush（Pull Requestのマージを含む）が行われると、GitHub Actionsがlintとproduction buildを実行し、成功した場合だけ自動的にデプロイします。

初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択してください。Actionsタブからワークフローを手動実行することもできます。

## License & Disclaimer

インタラクティブな光沢表現は [@simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css) を参考にしており、本プロジェクトは [GPL-3.0](./LICENSE) のもとで公開されています。

本プロジェクトは非公式のファンメイドツールです。株式会社ポケモンおよび関連各社とは関係なく、承認・提携を受けたものではありません。
