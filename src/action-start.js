var async = require('async');

// Starts google cloud compute instances
var start = function(gcloud, zoneName, instanceName, domainsToUpdate, done) {
  // Load up compute API
  var gce = gcloud.compute();

  // Get the zone
  var zone = gce.zone(zoneName);

  // Get the VM
  var vm = zone.vm(instanceName);

  // TODO: Convert to async.waterfall

  // Start it
  vm.start(function(err, operation, apiResponse) {
    if (err) {
      console.log('Error starting virtual machine instance:');
      console.log(err);
      return done(1);
    }

    console.log('VM is now starting (please wait a few seconds)...');

    operation.on('complete', function(metadata) {
      // The operation is complete.
      console.log('VM has started successfully! Now looking for IP...');

      // Fetch the new IP
      vm.get(function(err, vm, apiResponse) {
        if (err) {
          console.log('Error fetching new IP for virtual machine instance:');
          console.log(err);
          return done(1);
        }

        var newExternalIP = vm.metadata.networkInterfaces[0].accessConfigs[0].natIP;

        console.log('Found IP = ', newExternalIP);

        // If there are no domains to update, we can end here
        if (!domainsToUpdate) {
          console.log('No domains to update');
          console.log('');
          return done();
        }

        console.log('Now updating Cloud DNS...');

        // Fetch all zones
        var dns = gcloud.dns();

        // Parse the domains
        var parsedDomains = parseDomains(domainsToUpdate);

        console.log('##');
        console.log('# Locally, you can do, in your /etc/hosts');
        console.log(newExternalIP, parsedDomains.join(' '));
        console.log('##');

        dns.getZones(function(err, zones, apiResponse) {
          if (err) {
            console.log('Error fetching zones to update Cloud DNS:');
            console.log(err);
            return done(1);
          }

          // Loop through each parsed domain
          async.eachSeries(parsedDomains, function(domain, doneWithDomain) {
            // Loop through each zone to find this domain
            async.eachSeries(zones, function(zone, doneWithZone) {
              // If our domain is part of the zone's dns, we've got jackpot
              if (zone.metadata.dnsName.indexOf(domain) !== -1) {

                // Create a new A record
                var newARecord = zone.record('a', {
                  name: zone.metadata.dnsName,
                  data: newExternalIP,
                  ttl: 300
                });

                // Make the request to replace them (async)
                zone.replaceRecords('a', [newARecord], function(err, change, apiResponse) {
                  if (err) {
                    console.log('Error replacing A records in zone:');
                    console.log(err);
                    console.log(change);
                    return doneWithZone();
                  }

                  console.log('A Records updated for', domain);
                  return doneWithZone();
                });
              } else {
                doneWithZone();
              }
            }, doneWithDomain);
          }, function doneWithDomains(err) {
            if (err) {
              console.log('Error trying to match domains with Cloud DNS zones:');
              console.log(err);
              return done(1);
            }

            console.log('');

            done();
          });

        });
      });
    });
  });
};

// Parse domains
// @param domainsToUpdate String (e.g. "trydev.io,ctapp.net")
function parseDomains(domainsToUpdate) {
  // Split by comma
  var parsedDomains = domainsToUpdate.split(',');

  return parsedDomains;
}

module.exports = start;
