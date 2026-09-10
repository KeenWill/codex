# Codex fork

The `main` branch carries three patches on the stable upstream release named in
`.fork-base`:

- Exec JSONL errors retain `codexErrorInfo` and `willRetry`. Terminal
  `turn.failed` errors always report `willRetry: false`.
- `codex app-server --ignore-user-config --ignore-rules` forwards the existing
  configuration loader overrides.
- The guardian analytics test waits for its parent-turn event before shutting
  down app-server. This test-only fix is carried because the release workflow
  runs the app-server crate's tests.

`fork-sync.yml` checks upstream stable `rust-vX.Y.Z` tags every six hours
and supports manual dispatch. It rebases the carried commits with
`git rebase --onto <tag> <previous-base> main`, records the new base, and
pushes with a lease. **Only this workflow rewrites the published branch.**
Conflicts abort the rebase and open one `rebase conflict: <tag>` issue, listing
conflicting files; an existing open issue is reused. Resolve conflicts before
retrying the sync.

`main` is the fork's default branch so GitHub activates its schedule and manual
workflows.

`fork-release.yml` runs on branch pushes and manual dispatch; sync explicitly
dispatches it after its token-authenticated push. It tests the exec and app-server
crates and builds the Linux x86_64 musl multitool with upstream's Zig, libcap,
V8, and bwrap build steps on GitHub-hosted runners. The tarball also includes the
code-mode host, Responses API proxy, and bwrap companions.

Releases use `rust-vX.Y.Z-fork.N`, starting at 1 for each upstream version.
New commits on the same base increment N; rerunning an already released commit
does not publish another revision. Assets are
`codex-x86_64-unknown-linux-musl.tar.gz`, `SHA256SUMS` for the tarball, and
`BINARY_SHA256SUMS` for the extracted `codex` executable. Startup can verify
the exact fork binary even when several revisions share an upstream version.
`codex --version` retains the upstream version, without the fork suffix.

Add patches with ordinary commits to `main`, then push. Consumers pin
published release assets, not branch commits. To sync or release manually:

```sh
gh workflow run fork-sync.yml --repo KeenWill/codex --ref main
gh workflow run fork-release.yml --repo KeenWill/codex --ref main
```
