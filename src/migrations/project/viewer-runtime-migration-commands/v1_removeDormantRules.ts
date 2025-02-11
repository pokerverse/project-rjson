/**
 * Out of rules, elements and scenes, remove in this order:
 * 1) rules
 * 2) elements
 * 3) scenes
 * 
 * Rules:
 * There might be active rules without any whenEvents or thenAction that get deleted.
 * Which will impact element deletion also.
 * 
 * Elements:
 * There might be hotspot element deletions (hidden, no rules) which might impact scene deletion also.
 */

import { rtp, RT, RecordFactory } from "../../../r/R";
import { IOrder } from "../../IOrder";
import { ProjectFactory, SceneFactory } from "../../../r/recordFactories";

class Migration implements IOrder {
  execute (projectJson: any) {
    return migrateProject(projectJson);
  }
}

const migrateProject = (json: any) => {
  const projectF = new ProjectFactory(json);
  const scenes = projectF.getRecords(RT.scene);
  for(const s of scenes) {
    const sceneF = new SceneFactory(s);
    const ruleEntries = sceneF.getRecordEntries(RT.rule);
    for(const [rId, r] of ruleEntries) {
      const ruleF = new RecordFactory(r);
      if(ruleF.get(rtp.rule.disabled) === true) {
        sceneF.deleteRecord(rId, RT.rule);
        continue;
      }
      if( (ruleF.getRecordIds(RT.when_event).length === 0) || (ruleF.getRecordIds(RT.then_action).length === 0) ) {
        sceneF.deleteRecord(rId, RT.rule);
        continue;
      }
    }
  }
  return json;
}

const migration = new Migration();
export default migration;
