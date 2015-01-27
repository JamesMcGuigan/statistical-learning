#!/bin/bash -x
# @link http://techbrahmana.blogspot.co.uk/2013/10/creating-wildcard-self-signed.html

# NOTE: Copies of statistical-learning.san.key/statistical-learning.san.crt have been copied to /puppet/modules/sslcerts/files

cd    "$(dirname "$0")"

# Set Params
Country=GB
State=London
City=London
Organization="Crystalline Technologies"
Section=""
FQDN=statistical-learning.jamesmcguigan.com
Email=james.mcguigan@gmail.com


## Generate Private Key
openssl genrsa -des3 -passout pass:foobar -out statistical-learning.san.key.password 2048

##  Convert the private key to an unencrypted format
openssl rsa -passin pass:foobar -in statistical-learning.san.key.password -out statistical-learning.san.key

##  Create the certificate signing request
openssl req -new -key statistical-learning.san.key -out statistical-learning.san.csr <<EOF
$Country
$State
$City
$Organization
$Section
$FQDN
$Email
.
.
EOF

## Sign the certificate with extensions
openssl x509 -req -extensions v3_req -days 365 -in statistical-learning.san.csr -signkey statistical-learning.san.key -out statistical-learning.san.crt -extfile generate.san.conf
#    -CA ../rootCA/statistical-learning.rootCA.crt -CAkey ../rootCA/statistical-learning.rootCA.key -CAcreateserial

#
#openssl genrsa             -out statistical-learning.san.key 2048
#openssl req    -new -nodes -out statistical-learning.san.csr -config generate.san.conf
#openssl x509   -req -CA ../rootCA/statistical-learning.rootCA.pem -CAkey ../rootCA/statistical-learning.rootCA.key -CAcreateserial -in statistical-learning.san.csr -out statistical-learning.san.crt -days 3650
##end

exit 0