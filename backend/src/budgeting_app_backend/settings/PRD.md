# Feature: Backend Settings Module

## Overview

Persistent application configuration for upload state tracking.

## Features

### Upload State

Tracks when the last database restore occurred. The frontend compares this timestamp against its local state to detect server-side database resets and trigger a full resync.

## Default States

When a setting has never been written, the service returns a safe empty default:

- **Upload Details** — epoch date `1970-01-01` (signals no restore has occurred)
