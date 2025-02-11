import { RecordNode, rtp, RT } from "../../../r/R";
import { IOrder } from "../../IOrder";
import { ProjectFactory, SceneFactory } from "../../../r/recordFactories";
import { SceneType } from "../../../r/definitions/special";

class Migration implements IOrder {
  execute (projectJson: any) {
    return migrateProject(projectJson);
  }
}

/**
 * If scene_type is not present, make it first_person (360 scene)
 */
const migrateProject = (json: any) => {
  const pf = new ProjectFactory(json as RecordNode<RT.project>);

  for(const scene of pf.getRecords(RT.scene)) {
    const scenef = new SceneFactory(scene);
    const sceneTypeInProps = scenef.get(rtp.scene.scene_type);
    if(sceneTypeInProps === undefined) {
      scenef.set(rtp.scene.scene_type, SceneType.first_person);
    }
  }
  
  pf.set(rtp.project.version, 205);
  return json;
}

const migration = new Migration();
export default migration;
