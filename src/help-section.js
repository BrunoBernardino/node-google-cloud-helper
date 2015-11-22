// Shows help section
var showHelp = function() {
  console.log('');
  console.log('Usage: gcloud-helper [options]');
  console.log('');
  console.log(' A CLI Node.js helper for Google Cloud');
  console.log('');
  console.log(' Options:');
  console.log('');
  console.log('   -h, --help                                    output usage information');
  console.log('   start <zone-name> <instance-name> <domains>   start google compute engine instance, updating in Cloud DNS the domains (e.g. devdomain1.com,devdomain2.com) - it will replace the A records for them with just the new external IP');
  console.log('   stop <zone-name> <instance-name>              stop google compute engine instance');
  console.log('   delete <zone-name> <instance-name>            delete google compute engine instance');
  console.log('   list                                          lists all google compute engine instances (name, zone, status)');
  console.log('');
};

module.exports = showHelp;
