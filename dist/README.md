# Drata Compliance as Code Action

Use the Drata Compliance as Code action to scan for infrastructure-as-code findings in your pipeline. By utilizing this
GitHub action in your workflow, you can automatically start to find, fix and monitor for compliance related
configuration errors in Terraform.

## Highlighted Features

Using this Action provides the following features:

- App Security Design
- Infrastructure-as-Code Security Checks
- Automated Security Design Integration
- Security Design Enforcement
- Security Design Change Management
- Out of the box compliance regulations including: SOC 2, PCI DSS, ISO 27001, GDPR, CCPA HIPAA, HI TECH, State Regulations, NIS SP 800- 53

## Requirements

To run a scan on your code, you need access to [Drata platform](https://drata.com).

## Usage

The following is an example GitHub Actions workflow:

```yaml
on: push
jobs:
  drata-iac-scan:
    runs-on: ubuntu-latest
    name: compliance-as-code-action
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
      - name: Drata Github Action
        id: drata
        uses: drata/compliance-as-code-action@v1.0.0
        env:
          DRATA_API_TOKEN: ${{ secrets.DRATA_IAC_PIPELINE_KEY }}
          GITHUB_REPOSITORY: $GITHUB_REPOSITORY
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          minimumSeverity: "CRITICAL"
```

## Parameters

- `minimumSeverity` - **_(Required)_** The threshold at which a detected findings will cause your workflow to fail. One of `none`, `low`, `moderate`, `high`, or `critical`.
- `workspaceId` - **_(Optional)_** Your Drata platform workspace Id. Defaults to 1.
- `region` - **_(Optional)_** Your Drata platform region. One of 'US' or 'EU'. Defaults to 'US'.
- `verboseLogging` - **_(Optional)_** An indicator of whether you'd like any detected findings output to the GitHub Actions build log. Defaults to `false`.
- `timeoutSeconds` - **_(Optional)_** Time in seconds to wait for Drata tests to complete before failing. Defaults to `600`

## Secrets

- `DRATA_API_TOKEN` - **_(Required)_** This is the API key for your Drata Compliance as Code action workflow. The pipeline key can be created in Drata
- `GITHUB_REPOSITORY`: $GITHUB\*REPOSITORY - \*\*\*(Optional)\_\*\* Your GitHub Repository referenced in the Pipeline.
- `GITHUB_TOKEN`: ${{ secrets.GITHUB_TOKEN }} - **_(Optional)_** Your GitHub Token.
- Platform.
-

## License

This project is released under the Apache 2.0 License.
