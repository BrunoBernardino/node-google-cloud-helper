// Deletes google cloud compute instances
var remove = function(gcloud, zoneName, instanceName, done) {
  // Load up compute API
  var gce = gcloud.compute();

  // Get the zone
  var zone = gce.zone(zoneName);

  // Get the VM
  var vm = zone.vm(instanceName);

  // Delete it
  vm.delete(function(err, operation, apiResponse) {
    if (err) {
      console.log('Error deleting virtual machine instance:');
      console.log(err);
      return done(1);
    }

    console.log('VM is now being deleted.');

    console.log('');

    done();
  });
};

module.exports = remove;
