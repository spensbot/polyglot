TABLE_FILENAMES = [
    "1-1000",
    "1001-2000",
    "2001-3000",
    "3001-4000",
    "4001-5000",
    "5001-6000",
    "6001-7000",
    "7001-8000",
    "8001-9000",
    "9001-10000",
]


# These will return html pages with a table of words, ordered by use frequency.
#
# These will have the following format:
# <tbody><tr>
# <th>Traditional</th>
# <th>Simplified</th>
# <th>Pinyin</th>
# <th>Meaning
# </th></tr>
# <tr>
# <td><span class="Hant" lang="zh-Hant"><a href="/wiki/%E4%B8%80#Chinese" title="一">一</a></span></td>
# <td><span class="Hans" lang="zh-Hans"><a href="/wiki/%E4%B8%80#Chinese" title="一">一</a></span></td>
# <td><span class="Latn" lang="cmn-Latn-pinyin"><a href="/wiki/y%C4%AB#Mandarin" title="yī">yī</a></span></td>
# <td>det.: one <style data-mw-deduplicate="TemplateStyles:r50165410">.mw-parser-output .k-player .k-attribution{visibility:hidden}</style><table class="audiotable" style="vertical-align: middle; display: inline-block; list-style: none; line-height: 1em; border-collapse: collapse; margin: 0;"><tbody><tr><td>yī<span class="ib-colon qualifier-colon">:</span></td><td class="audiofile"><span typeof="mw:File"><span><audio id="mwe_player_0" controls="" preload="none" data-mw-tmh="" class="mw-file-element" width="175" style="width:175px;" data-durationhint="1" data-mwtitle="Zh-yi1.ogg" data-mwprovider="wikimediacommons"><source src="//upload.wikimedia.org/wikipedia/commons/6/64/Zh-yi1.ogg" type="audio/ogg; codecs=&quot;vorbis&quot;" data-width="0" data-height="0" /><source src="//upload.wikimedia.org/wikipedia/commons/transcoded/6/64/Zh-yi1.ogg/Zh-yi1.ogg.mp3" type="audio/mpeg" data-transcodekey="mp3" data-width="0" data-height="0" /></audio></span></span></td><td class="audiometa" style="font-size: 80%;">(<a href="/wiki/File:Zh-yi1.ogg" title="File:Zh-yi1.ogg">file</a>)</td></tr></tbody></table>
# </td></tr>
# <tr>
# <td><span class="Hant" lang="zh-Hant"><a href="/wiki/%E5%9C%A8#Chinese" title="在">在</a></span></td>
# <td><span class="Hans" lang="zh-Hans"><a href="/wiki/%E5%9C%A8#Chinese" title="在">在</a></span></td>
# <td><span class="Latn" lang="cmn-Latn-pinyin"><a href="/wiki/z%C3%A0i#Mandarin" title="zài">zài</a></span></td>
# <td>in, at, on, etc. <link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r50165410" /><table class="audiotable" style="vertical-align: middle; display: inline-block; list-style: none; line-height: 1em; border-collapse: collapse; margin: 0;"><tbody><tr><td>zài<span class="ib-colon qualifier-colon">:</span></td><td class="audiofile"><span typeof="mw:File"><span><audio id="mwe_player_1" controls="" preload="none" data-mw-tmh="" class="mw-file-element" width="175" style="width:175px;" data-durationhint="1" data-mwtitle="Zh-zài.ogg" data-mwprovider="wikimediacommons"><source src="//upload.wikimedia.org/wikipedia/commons/9/94/Zh-z%C3%A0i.ogg" type="audio/ogg; codecs=&quot;vorbis&quot;" data-width="0" data-height="0" /><source src="//upload.wikimedia.org/wikipedia/commons/transcoded/9/94/Zh-z%C3%A0i.ogg/Zh-z%C3%A0i.ogg.mp3" type="audio/mpeg" data-transcodekey="mp3" data-width="0" data-height="0" /></audio></span></span></td><td class="audiometa" style="font-size: 80%;">(<a href="/wiki/File:Zh-z%C3%A0i.ogg" title="File:Zh-zài.ogg">file</a>)</td></tr></tbody></table>
# </td></tr>
def getUrl(tableFilename):
    # Wiktionary pages do not require .html suffix.
    return f"https://en.wiktionary.org/wiki/Appendix:Mandarin_Frequency_lists/{tableFilename}"


# Saves the traditional, simplified, pinyin, and meaning columns to a TSV file in src/dictionary/chinese/data/wiktionary.csv
def saveWiktionaryToTsv():
    """Fetch configured Wiktionary Mandarin frequency tables and write a TSV.

    Output path: src/dictionary/chinese/data/wiktionary.csv (tab separated).
    Columns: traditional, simplified, pinyin, meaning.
    """
    import html
    import re
    import time
    from urllib.request import Request, urlopen
    from pathlib import Path

    # Simple <tr> extraction within table body; avoid external dependencies.
    # We look for header row then subsequent <tr> rows with 4 <td> cells.
    TR_PATTERN = re.compile(r"<tr>(.*?)</tr>", re.IGNORECASE | re.DOTALL)
    TD_PATTERN = re.compile(r"<td>(.*?)</td>", re.IGNORECASE | re.DOTALL)

    def strip_tags(cell_html: str) -> str:
        # Remove all tags, collapse whitespace, unescape entities.
        txt = re.sub(r"<[^>]+>", "", cell_html)
        txt = html.unescape(txt)
        txt = re.sub(r"\s+", " ", txt).strip()
        return txt

    PINYIN_COLON_PATTERN = re.compile(
        r"^[a-zāēīōūǖáéíóúǘǎěǐǒǔǚàèìòùǜ]+:\Z", re.IGNORECASE
    )

    def clean_meaning(raw: str, pinyin_value: str) -> str:
        # Remove trailing audio table remnants like 'yī:' matching the row's pinyin or any pinyin token ending with ':'
        parts = raw.split()
        filtered: list[str] = []
        for tok in parts:
            if tok.lower() == "audio:":
                continue
            if PINYIN_COLON_PATTERN.match(tok):
                continue
            # Sometimes the exact pinyin + ':' appears (e.g., yī:) - drop it
            if tok == f"{pinyin_value}:":
                continue
            filtered.append(tok)
        cleaned = " ".join(filtered).strip()
        return cleaned

    rows: list[tuple[str, str, str, str]] = []
    for filename in TABLE_FILENAMES:
        url = getUrl(filename)
        req = Request(
            url, headers={"User-Agent": "Mozilla/5.0 (compatible; PolyglotBot/1.0)"}
        )
        with urlopen(req) as resp:
            raw = resp.read().decode("utf-8", errors="replace")

        # Narrow to table with expected headers by finding the header sequence.
        # We assume the first table that contains Traditional/Simplified/Pinyin/Meaning is our target.
        table_start = raw.lower().find("traditional")
        if table_start == -1:
            continue

        # Extract all <tr> blocks after the header.
        for tr_html in TR_PATTERN.findall(raw):
            # Skip header row containing <th> tags.
            if "<th" in tr_html.lower():
                continue
            cells = TD_PATTERN.findall(tr_html)
            if len(cells) != 4:
                continue
            traditional = strip_tags(cells[0])
            simplified = strip_tags(cells[1])
            pinyin = strip_tags(cells[2])
            meaning = strip_tags(cells[3])
            if not traditional or not simplified or not pinyin:
                continue
            meaning_clean = clean_meaning(meaning, pinyin)
            rows.append((traditional, simplified, pinyin, meaning_clean))
        # Be polite to the server.
        time.sleep(0.5)

    # Write TSV (tab separated) even though file name uses .csv.
    project_root = Path(__file__).resolve().parents[1]
    out_path = project_root / "src/public/wiktionary.tsv"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        f.write("traditional\tsimplified\tpinyin\tmeaning\n")
        for t, s, p, m in rows:
            # Ensure tabs/newlines inside meaning are normalized.
            m_clean = m.replace("\t", " ").replace("\n", " ")
            f.write(f"{t}\t{s}\t{p}\t{m_clean}\n")
    print(f"Wrote {len(rows)} rows to {out_path.relative_to(project_root)}")


if __name__ == "__main__":  # pragma: no cover
    saveWiktionaryToTsv()
