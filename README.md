# Manifest za obnovu Srbije

[Manifest za obnovu Srbije](https://vsjov.github.io/manifest-za-obnovu-srbije) je građanski i nestranački dokument koji analizira razgradnju institucija, korupciju, zarobljavanje države, medijsku propagandu, odliv ljudi i poništavanje demokratskog napretka u Srbiji. Dokument predlaže trinaest načela za obnovu države: suverenitet institucija, radikalnu transparentnost, obrazovanje, ekonomsko dostojanstvo, slobodu štampe, građansko učešće, meritokratiju, ograničenje koncentracije vlasti, kulturni preporod, povratak dijaspore, razdvajanje crkve i države, lustraciju i povraćaj opljačkane države.

Ovaj manifest ne pripada nijednoj stranci, vođi ili pokretu. Namenjen je građanima koji veruju da Srbija može biti slobodnija, pravednija, odgovornija i institucionalno zdravija država.

**Autor:** [Vladimir Jovanović](https://github.com/vsjov) | **Godina:** 2026. | **Licenca:** [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

## Razvoj

Za rad na sajtu potrebni su nativni Pannonico Pro sa podrškom za `rich-markdown` i Node.js 24 ili noviji.

```sh
npm ci
```

Proverite TypeScript kod za pregledač i izgradite Vite resurse zajedno sa sajtom:

```sh
npm run typecheck
npm run build
```

Pokrenite integrisani razvojni režim Pannonico Pro-a, koji upravlja lokalnim Vite procesom projekta i zaustavlja ga zajedno sa serverom sajta:

```sh
pannonico watch .
```

Pannonico upisuje kompletan sajt u `dist/`. Ovaj repozitorijum prati taj direktorijum zato što GitHub Pages objavljuje njegov sadržaj sačuvan u repozitorijumu.
