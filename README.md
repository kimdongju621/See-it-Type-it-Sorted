# See-it-Type-it-Sorted

간단한 폰트 테스트 페이지 예제입니다.

로컬 테스트
- `fonts/` 폴더에 폰트 파일을 넣으세요. (예: `LDN Round.woff2`, `MAN HEX.woff2`, `EDISerif.woff2`, `NeueHaasUnica-Bold.woff2`)
- 로컬 서버 실행:

```bash
python3 -m http.server 8000

# 브라우저에서 http://localhost:8000 를 엽니다.
```

GitHub Pages로 배포(사파리에서 바로 열기)
- 이 저장소를 GitHub에 푸시하면 `.github/workflows/deploy.yml` 워크플로우가 자동으로 실행됩니다.
- 워크플로우가 성공하면 사이트는 보통 다음 주소에서 접근할 수 있습니다:

```
https://<GitHub사용자명>.github.io/<리포지토리명>/
```

예: `https://kimdongju621.github.io/See-it-Type-it-Sorted/`

배포 절차
1. 변경사항 커밋 및 푸시

```bash
git add .
git commit -m "Add font tester and Pages deploy workflow"
git push origin main
```

2. GitHub Actions 탭에서 워크플로우 상태 확인
3. 배포 성공 후 위의 URL을 사파리에서 열어 테스트하세요.

파일 설명
- `index.html`: UI
- `styles.css`: 스타일 및 @font-face (workspace의 `fonts/` 폴더의 파일명에 맞게 수정 가능)
- `app.js`: 제어 로직 (폰트/크기/자간/행간/색/정렬, 영어 필터)
# See-it-Type-it-Sorted