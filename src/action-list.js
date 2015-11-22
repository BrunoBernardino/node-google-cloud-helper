// Lists google cloud compute instances
var list = function(gcloud, done) {
  // Load up compute API
  var gce = gcloud.compute();

  // Get virtual machine instances
  gce.getVMs(function(err, vms) {
    if (err) {
      console.log('Error fecthing virtual machine instances:');
      console.log(err);
      return done(1);
    }

    console.log('Here they are `# [name] ([zone] - [status])`:');
    console.log('');

    // Loop each VM and list it
    vms.forEach(function(vm) {
      console.log('# ' + vm.metadata.name + ' (' + vm.zone.name + ' - ' + vm.metadata.status + ')');
    });

    console.log('');

    done();
  });
};

module.exports = list;
