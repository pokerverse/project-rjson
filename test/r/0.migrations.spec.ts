import { expect } from "chai";
import { createNewDeployment, migrateDeployment } from "../../src/migrations/deployment/index";
import { runProjectMigrations } from "./../../src/migrations/project";
import { migrateDiscussion } from "./../../src/migrations/discussion";
import { RT } from "../../src/r/R";
import fs from "fs";
import deploymentJson from "./jsons/deployment.json";
import campusJson from "./jsons/campus.json";
import oldProjectJson from "./jsons/oldProject.json";
import newtonStoreJson from "./jsons/newtonStore.json";
import manishMalhotraJson from "./jsons/manishMalhotra.json";
import deleteRecordsLinkedToIdJson from "./jsons/deleteRecordsLinkedToId.json";
import threeScenesJson from "./jsons/threeScenes.json";
import discussionJson from "./jsons/discussion.json";
import myMetaverseJson from "./jsons/myMetaverse.json";
import learningJson from "./jsons/learning.json";
import safeHandsJson from "./jsons/safeHands.json";
import characterSpeaksJson from "./jsons/characterSpeaks.json";

describe ("r Migration tests", () => {
  it ("should create new deployment", () => {
    const deployment = createNewDeployment();
    expect(deployment.type).to.be.equal(RT.deployment);
  });

  xit ("migrate elements", function () {
    this.timeout(30000);
    fs.writeFileSync("./test/r/jsons/r3fJsons/deployment/deployment.json", JSON.stringify(migrateDeployment(deploymentJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/safeHands.json", JSON.stringify(runProjectMigrations(safeHandsJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/newton.json", JSON.stringify(runProjectMigrations(newtonStoreJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/manish.json", JSON.stringify(runProjectMigrations(manishMalhotraJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/old.json", JSON.stringify(runProjectMigrations(oldProjectJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/deleteRecordsLinkedToId.json", JSON.stringify(runProjectMigrations(deleteRecordsLinkedToIdJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/threeScenesJson.json", JSON.stringify(runProjectMigrations(threeScenesJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/myMetaverse.json", JSON.stringify(migrateDiscussion(myMetaverseJson)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/discussion/discussion.json", JSON.stringify(migrateDiscussion(discussionJson)));
    expect(true).to.be.true;
  });

  xit("should migrate a large project json", function() {
    this.timeout(7000);
    const st = performance.now();
    console.log("Started large migration at:", st);
    const migratedProject = runProjectMigrations(learningJson);
    const et = performance.now();
    console.log("Ended large migration at:", et);
    //fs.writeFileSync("./test/r/jsons/r3fJsons/project/learning.json", JSON.stringify(migratedProject));
  });

  xit("Testing if rule ids cycle correctly", function() {
    this.timeout(5000);
    const st = performance.now();
    console.log("Started large migration at:", st);
    const migratedProject = runProjectMigrations(campusJson, 200);
    const et = performance.now();
    console.log("Ended large migration at:", et);
    //fs.writeFileSync("./test/r/jsons/r3fJsons/project/campus.json", JSON.stringify(migratedProject));
  });

  xit ("should test 210 migration", () => {
    fs.writeFileSync("./test/r/jsons/r3fJsons/project/characterSpeaks.json", JSON.stringify(runProjectMigrations(characterSpeaksJson)));
  });
});
