# Google Cloud Helper

The idea of this CLI tool is to basically start, stop and delete Google Compute Engine instances, while automatically mapping the ephemeral IPs in Google Cloud DNS.

I'm using this for remote development.

## Installation

`$ npm install -g gcloud-helper`

## Usage

`$ gcloud-helper start europe-west1-b dev-1 domain1.com,domain2.com`

## Setup

### Variables

Some variables have to be set in the env (`/etc/environment`, `~/.bashrc` or even `export`):

- `GCLOUD_PROJECT_KEY_JSON`, e.g. '/home/you/gcloud-key.json'
- `GCLOUD_PROJECT_ID`, e.g. 'grape-spaceship-123'

## TODO:

- [ ] Add linter
- [ ] Add unit tests for commands, arguments, showing help, spying on what's called from gcloud, etc.
- [ ] Support subdomains on instance start, for Cloud DNS update? ()
