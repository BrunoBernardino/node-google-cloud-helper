// Stops google cloud compute instances
var stop = function(gcloud, zoneName, instanceName, done) {
  // Load up compute API
  var gce = gcloud.compute();

  // Get the zone
  var zone = gce.zone(zoneName);

  // Get the VM
  var vm = zone.vm(instanceName);

  // Stop it
  vm.stop(function(err, operation, apiResponse) {
    if (err) {
      console.log('Error stopping virtual machine instance:');
      console.log(err);
      return done(1);
    }

    console.log('VM is now stopping (please wait a few seconds)...');

    operation.on('complete', function(metadata) {
      // The operation is complete.
      console.log('VM has stopped successfully!');

      console.log('');

      done();
    });
  });
};

module.exports = stop;
