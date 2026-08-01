# Security Policy

## Supported Versions

Only the latest published version of `@nexusocean/firo-rpc` on npm is supported with security fixes.

## Reporting a Vulnerability

Please report security vulnerabilities privately through [GitHub Security Advisories](https://github.com/NexusOcean/firo-rpc/security/advisories/new) rather than opening a public issue.

Include, if possible:

- A description of the vulnerability and its impact.
- Steps to reproduce, or a minimal example.
- The version of `@nexusocean/firo-rpc` affected.

This library is an RPC client — it does not hold funds or private keys itself, but it does transmit RPC credentials and can invoke wallet-affecting methods (e.g. `sendtoaddress`) against a configured Firo node. Vulnerabilities that could lead to credential leakage, request forgery, or unintended wallet operations are in scope.

We'll acknowledge reports as soon as we can and keep you updated as a fix is developed.
