var express = require('express');
var router = express.Router();
var kafka = require('kafka-node');
var socketIn;
const io = require("socket.io")({
  cors: {
    origin: '*',
  }
});
io.listen(3012);
var app = express();
let activeConsumers = {};
io.on("connection", socket => {
  socketIn = socket;
  console.log('cennected...');
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    status: 'running'
  });
});


router.get('/config', function (req, res, next) {

  const client = new kafka.KafkaClient();
  const admin = new kafka.Admin(client); // client must be KafkaClient

  const resource = {
    resourceType: admin.RESOURCE_TYPES.topic, // 'broker' or 'topic'
    resourceName: 'Topic-name-1',
    configNames: [] // specific config names, or empty array to return all,
  }

  const payload = {
    resources: [resource],
    includeSynonyms: false // requires kafka 2.0+
  };

  admin.describeConfigs(payload, (err, _res) => {
    console.log(err, '..err');
    // console.log(JSON.stringify(res,null,1));
    res.send(_res);
  })


});


router.post('/connect', function (req, res, next) {
  const data = req.body;
  console.log(data, '......data');
  // delete data.connectRetryOptions;
  // data.requestTimeout = 10;
  const client = new kafka.KafkaClient(data);
  const admin = new kafka.Admin(client); // client must be KafkaClient
  admin.listGroups((err, _res) => {
    res.send({
      status: "success"
    });
  });

  admin.on('error', (error) => {
    res.send({
      status: 'failed',
      error
    });
  });

});


/* GET users listing. */
router.get('/group-list', function (req, res, next) {
  const client = new kafka.KafkaClient();
  const admin = new kafka.Admin(client); // client must be KafkaClient
  admin.listGroups((err, _res) => {
    res.send(_res);
  });
});


router.get('/delete-topics/:name', function (req, res, next) {

  // const Consumer = kafka.Consumer,
  //   client = new kafka.KafkaClient(),
  //   consumer = new Consumer();

  // consumer.removeTopics([req.params.name], (err, removed) => {
  //   console.log(err, '......err');
  //   res.send({
  //     status: 'removed',
  //     data: removed
  //   });
  // });
  console.log(req.params.name, '...req.params.name');
  const Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(client, [{
      topic: req.params.name
    }]);
  // consumer = new Consumer(
  //   client,
  //   // [{
  //   //   topic: req.params.name,
  //   //   partition: 0
  //   // }], {
  //   //   autoCommit: false
  //   // }
  // );

  consumer.addTopics([req.params.name], function (err, added) {
    res.send({
      status: true,
      data: _res
    });
  });


  // const client = new kafka.KafkaClient();
  // const consumer = new kafka.Consumer(client); // client must be KafkaClient

  // client.removeTopics([req.params.name], (err, _res) => {
  //   console.log(err, '......err');
  //   res.send({
  //     status: true,
  //     data: _res
  //   });
  //   // result is an array of any errors if a given topic could not be created
  // })




});


/* GET users listing. */
router.get('/topics-list', function (req, res, next) {
  const client = new kafka.KafkaClient();
  const admin = new kafka.Admin(client); // client must be KafkaClient
  admin.listTopics((err, _res) => {
    res.send(_res);
  });
});


/* GET users listing. */
router.post('/get-message', function (req, res, next) {

  const {
    connectiondata
  } = req.headers;


  const {
    add: {
      topic,
      partition
    },
    // leave: {
    //   topicOld = false,
    //   partitionOld = 0
    // }
  } = req.body;

  // if (activeConsumers.indexOf(topic) !== -1) {
  //   res.send({
  //     status: true,
  //     msg: "Already active"
  //   });
  //   return false;
  // }

  const addClient = [];
  for (let i = 0; i < partition; i++) {
    addClient.push({
      topic,
      partition: i
    });
  }
  console.log(addClient, '...addClient');

  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient(JSON.parse(connectiondata));
  const consumerAdd = new Consumer(
    client,
    addClient, {
      autoCommit: false
    }
  );
  // console.log(topicOld, partitionOld, '------->')
  // if (topicOld && activeConsumers[topicOld]) {
  //   console.log('enter delete chat............');
  //   // const consumerLeave = new Consumer(
  //   //   client,
  //   //   [{
  //   //     topicOld,
  //   //     partition: Number(partitionOld),
  //   //   }], {
  //   //     autoCommit: false
  //   //   }
  //   // );

  //   activeConsumers[topicOld].close(function (err, data) {
  //     console.log(err);
  //     console.log(data, '....levae...');
  //   });

  // }

  if (activeConsumers && Object.keys(activeConsumers).length > 0) {
    Object.keys(activeConsumers).forEach(key => {
      activeConsumers[key].close(function (err) {
        console.log(err);
      });
    });
    activeConsumers = {};
  }


  activeConsumers[topic] = consumerAdd;

  consumerAdd.on('message', function (message) {
    // console.log(message, '.....message mil gaya');
    socketIn.emit("receiveMessage", message);
  });

  res.send({
    status: true
  });
});

router.get('/sent-message/:topic/:partition/:msg', function (req, res, next) {
  const {
    topic,
    msg,
    partition
  } = req.params;

  var Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.KafkaClient(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message');

  const payloads = [{
    topic,
    partition: Number(partition),
    messages: msg
  }];
  console.log(payloads, 'messages sent payloads.......................');

  producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
      console.log(data, payloads, 'messages sent.......................');
      res.send(data);
    });
  });
});

router.post('/add-topic', function (req, res, next) {
  const {
    partition,
    replicationFactor,
    topic
  } = req.body;

  var topics = [{
    topic,
    partitions: partition,
    replicationFactor
  }];

  console.log(topics, '.......topics');
  const client = new kafka.KafkaClient();
  const admin = new kafka.Admin(client); // client must be KafkaClient
  admin.createTopics(topics, (err, _res) => {
    if (_res.length) {
      const [data] = _res;
      const error = data.error;

      if (error) {
        res.send({
          status: true,
          data: _res,
          error
        });
      } else {
        res.send({
          status: true,
          data: _res
        });
      }
    } else {
      res.send({
        status: true,
        data: _res
      });
    }


    // result is an array of any errors if a given topic could not be created
  })
});


router.post('/sent-message', function (req, res, next) {
  console.log(req.body, '.......req.body');
  const {
    topic,
    partition,
    attributes,
    key = '',
    messages
  } = req.body;
  var Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.KafkaClient(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message');


  const payloadsObj = {
    topic,
    partition: Number(partition),
    attributes,
    key,
    messages
  };

  if (key === '') {
    delete payloadsObj['key'];
  }

  producer.on('ready', function () {
    producer.send([payloadsObj], function (err, data) {
      console.log(err, '...err')
      res.send(data);
    });
  });

});

module.exports = router;