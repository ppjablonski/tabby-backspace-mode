# tabby-backspace-mode

## Cel
Plugin do emulatora terminala Tabby, który dodaje opcję "Backspace key mode"
do profili innych niż SSH (lokalne powłoki, WSL, serial itd.).
Dziś ta opcja istnieje tylko w profilach SSH.

## Środowisko
- Rozwój: ten komputer (Linux, najpewniej bez GUI). Tabby tu nie uruchomisz.
- Cel: inny komputer (zakładam Windows, patrz sekcja "Dostawa"). Plugin budujemy tutaj,
  kopiujemy i instalujemy ręcznie na docelowym komputerze.
- Stack: TypeScript, Angular i webpack, tak jak w oficjalnych pluginach Tabby.
- Katalog startowy był pusty. Potrzebne rzeczy pobierz sam.

## Komunikacja
- Ze mną rozmawiaj po polsku, krótko i konkretnie.
- Kod, komentarze, commity i README po angielsku.

## Oszczędzanie limitu (ważne)
- Tabby jest duży: klonuj płytko (`git clone --depth 1`) do `./_ref/` (w .gitignore)
  i szukaj przez grep/glob. Nie czytaj całych plików, tylko potrzebne fragmenty.
- Nie używaj subagentów, jeśli nie ma wyraźnej potrzeby.
- Komendy uruchamiaj z cichym wyjściem (npm --silent, --quiet), długie logi obcinaj.
- Nie powtarzaj odczytów tych samych plików i nie podsumowuj każdego kroku.
- Plan robi model zaawansowany (opusplan). Implementacja idzie modelem efektywnym.

## Git
- `git init`, gałąź główna `main`, od razu `.gitignore` (node_modules, dist, _ref, *.tgz).
- Pracuj na gałęziach funkcyjnych przez `git worktree add` (jeden katalog na gałąź),
  nie przez przełączanie `git switch`.
- Małe, logiczne commity z konwencjonalnymi komunikatami (feat:, fix:, docs:, chore:).
- Bez przepisywania historii i bez force-push. Nie publikuj nigdzie (npm/GitHub) bez mojej zgody.

## Zasady pracy
- Najpierw zbadaj, jak SSH w Tabby realizuje Backspace mode i jak pluginy
  rozszerzają ustawienia profili i obsługę wejścia terminala. Idź tą samą drogą
  co upstream, jeśli się da.
- Nie forkuj i nie patchuj rdzenia Tabby. Jeśli bez tego się nie da, STOP i zapytaj.
- Preferuj istniejące API Tabby zamiast obejść.
- Logikę mapowania klawisza wydziel do czystych funkcji i pokryj testami jednostkowymi.
- Rozróżniaj uczciwie: co przetestowano automatycznie, a czego nie dało się
  sprawdzić (np. UI Tabby na docelowym komputerze). Nie pisz "działa", jeśli tego nie sprawdzono.

## Dostawa
- Wynik: gotowa paczka (`npm pack` -> .tgz albo katalog gotowy do skopiowania)
  + `INSTALL.md` z dokładnymi krokami instalacji i odinstalowania na docelowym systemie
  (zweryfikowanymi z dokumentacją/źródłami Tabby: lokalizacja katalogu pluginów,
  wymagana struktura, restart).
- `README.md`: co robi plugin, jak go używać, obsługiwane wersje Tabby.
- Zapisz wersję Tabby, względem której powstawał plugin.
