'use strict';

import {expect} from 'chai';
import * as Docker from 'dockerode';
import * as os from 'os';

describe('Test - DO nothing', () => {

  it(`Pass test Case`, () => {
    return;
  });

});


describe('Check docker MySQL is running', () => {

  it(`Check container exists test Case`, () => {

    const isWin = os.type() === 'Windows_NT';
    const socket = process.env.DOCKER_SOCKET || isWin ? '//./pipe/docker_engine' : '/var/run/docker.sock';
    const docker = new Docker({socketPath: socket});
    const container = docker.getContainer('mysql');
    const container_opts = {stream: true, stdin: true, stdout: true, stderr: true};

    container.stats(container_opts, function(err, stream) {
      expect(err).to.be.null;
      expect(stream.pipe).to.be.ok;
    });
  });
});
