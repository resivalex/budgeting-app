# Feature: Backend Settings Module

## Overview

Persistent application configuration for upload state tracking.

## Features

### Upload State

Tracks when the last database restore occurred. The frontend compares this timestamp against its local state to detect server-side database resets and trigger a full resync.


