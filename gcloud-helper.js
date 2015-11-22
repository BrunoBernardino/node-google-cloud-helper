#!/usr/bin/env node

// Define gcloudOptions
var gcloudOptions = {
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_PROJECT_KEY_JSON
};

// Get Google's own amazing Cloud package
var gcloud = require('gcloud')(gcloudOptions);

// Load help section
var showHelp = require('./src/help-section.js');

//
// Analyze what the first argument is (can be start/stop/list/delete)
//
var firstArgument = process.argv[2];

// List of allowed first arguments/commands
var allowedFirstArguments = ['start', 'stop', 'list', 'delete'];

// If the argument is not recognized, show help
if (allowedFirstArguments.indexOf(firstArgument) === -1) {
  // If the argument wasn't --help or -h, show an additional notice
  if (firstArgument !== '--help' && firstArgument !== '-h') {
    console.log('');
    console.log('  ERROR: Argument not recognized (' + firstArgument + ').');
    console.log('');
  }

  showHelp();
  return process.exit(1);
}

// Get the zone name (second argument)
var zoneName = process.argv[3];
// Get the instance name (third argument)
var instanceName = process.argv[4];
// Get the domains to update (fourth argument)
var domainsToUpdate = process.argv[5];

//
// Validate second and third arguments for start, stop, and delete
//
if (firstArgument === 'start' || firstArgument === 'stop' || firstArgument === 'delete') {
  // If there's no zone name, show help
  if (!zoneName) {
    console.log('');
    console.log('  ERROR: Second argument (Zone Name) not recognized (' + zoneName + ').');
    console.log('');

    showHelp();
    return process.exit(0);
  }

  // If there's no instance name, show help
  if (!instanceName) {
    console.log('');
    console.log('  ERROR: Third argument (Instance Name) not recognized (' + instanceName + ').');
    console.log('');

    showHelp();
    return process.exit(0);
  }
}

// If the first argument was start, beam it up!
if (firstArgument === 'start') {
  require('./src/action-start.js')(gcloud, zoneName, instanceName, domainsToUpdate, function(errorCode) {
    // End the app
    return process.exit(errorCode || 0);
  });
}

// If the first argument was stop, turn down for what!
if (firstArgument === 'stop') {
  require('./src/action-stop.js')(gcloud, zoneName, instanceName, function(errorCode) {
    // End the app
    return process.exit(errorCode || 0);
  });
}

// If the first argument was delete, shut it down!
if (firstArgument === 'delete') {
  require('./src/action-delete.js')(gcloud, zoneName, instanceName, function(errorCode) {
    // End the app
    return process.exit(errorCode || 0);
  });
}

// If the first argument was list, list the instances
if (firstArgument === 'list') {
  require('./src/action-list.js')(gcloud, function(errorCode) {
    // End the app
    return process.exit(errorCode || 0);
  });
}
