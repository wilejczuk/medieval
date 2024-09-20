import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import InternalService from '../../services/internal-api';
import './genealogy.css';

const Genealogy = () => {
  const stampsData = new InternalService();

  const [dukes, setDukes] = useState([{ name: 'Placeholder', children: [] }]);
  const [startNode, setStartNode] = useState(228);
  const data = new InternalService();
  const treeRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(700);
  const [treeKey, setTreeKey] = useState(Date.now()); 

  const handleStartNodeClick = (nodeId) => {
    setStartNode(nodeId);
    setTreeKey(Date.now());
  };
  
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps
  }) => {
    const counterClass = nodeDatum.stamps_count>0 ? '' : 'greyed';
    const patron = nodeDatum.patron ? nodeDatum.patron + ', ' : '';
    const handleSetStartNode = () => {
      setStartNode(nodeDatum.id);
      setTreeKey(Date.now());
    };
    const handleSetParentNode = () => {
      setStartNode(nodeDatum.parent); 
      setTreeKey(Date.now());
    };
    const arrowDirection = (nodeDatum.id === startNode) ? 
      (<span onClick={handleSetParentNode}>⇞</span>) :
      (<span onClick={handleSetStartNode}>⇟</span>);

    const metSaints = nodeDatum.saint_names && nodeDatum.saint_names.map((el) => {
      if (nodeDatum.fathers_patron === el)
        return (<span>{el} <span className="circle-father">F</span> </span>)
      else return (<span>{el} <span className="circle-warning">!</span> </span>)  
    });  
    return (
      <g>
        <foreignObject {...foreignObjectProps}>
          <div style={{ backgroundColor: "black" }}>
            <div style={{ textAlign: "center" }}><a target="_blank" href={nodeDatum.link}>{nodeDatum.name}</a> <span className={counterClass}>({nodeDatum.stamps_count})</span></div>
            <div className='additional'>{patron}{nodeDatum.death}</div>
            <div> 
              {nodeDatum.sign_links && nodeDatum.sign_links.length > 0 && (
                <div>
                  {nodeDatum.sign_links.map((link, index) => {
                    let signSearchLink = `/search/signs/${link.match(/signs\/(.*?)\./)[1]}/other/nulla`;
                    let imgKey = 'sign' + link.match(/signs\/(.*?)\./)[1];
                    return (
                      <a target="_blank" href={signSearchLink}>
                        <img key={imgKey} src={link} alt={`Sign ${index + 1}`} className='sign_little' />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            <div> 
              {nodeDatum.saint_names && nodeDatum.saint_names.length > 0 && (
                <div className="additional">
                  {metSaints}
                  
                </div>
              )}
            </div>
            <div className='button_up'>{arrowDirection}</div>
          </div>
        </foreignObject>
      </g>
    );
  }

  function buildTree(inputArray) {
    const nodeMap = {};
    inputArray.forEach(node => {
        node.children = [];
        node.attributes = { 
          id: node.id
        };
        nodeMap[node.id] = node;
    });

    const rootNode = inputArray.find((el)=>el.id===startNode);

    function addNodeToParent(node, depth) {
        if (depth < 4) {
            node.children = inputArray.filter(child => child.parent === node.id);
            node.children.forEach(child => {
                addNodeToParent(child, depth + 1);
            });
        }
    }

    addNodeToParent(rootNode, 0);

    return rootNode;
  }

  useEffect(() => {
    const exculdeSaints_ru = ['Богоматерь', 'Иисус', 'Святой', 'Святая'];
    const exculdeSaints = ['Our Lady', 'Jesus', 'Saint'];
    data.getDukesGenealogy()
    .then((body) => {
      const simplified = body.data.filter(el=>el.idFather!== null).map(({
        id,
        name,
        name_en,
        dateBirth,
        dateDeath,
        datePower,
        birthProximity,
        powerProximity,
        deathProximity,
        idFather,
        idHusband,
        stamps_count,
        sign_ids,
        saint_names,
        patron,
        fathersPatron
      }) => {
          const birth = dateBirth ? `${birthProximity?'≈':''}${dateBirth} ` : '';
          const power = datePower ? `ϡ ${powerProximity?'≈':''}${datePower} ` : '';
          const death = dateDeath ? `† ${deathProximity?'≈':''}${dateDeath}` : '';
          const dates = `${birth}${power}${death}`;

          const signIds = sign_ids ? sign_ids.split(',') : [];
          let signLinks = [];
          signIds.forEach(element => {
            signLinks.push(stampsData._apiBase + 'signs/' + element);
          });

          const exculdePatron = exculdeSaints + patron;
          let saintNames = saint_names ? saint_names.split(',') : [];
          saintNames = saintNames.filter((el) => !exculdePatron.includes(el));

          return {
            id: id,
            name: name_en.split(" ")[0],
            death: death,
            parent: idFather,
            link: `/person/${id}`,
            stamps_count: stamps_count,
            sign_links: signLinks,
            saint_names: saintNames,
            patron: patron,
            fathers_patron: fathersPatron
          };
      });
      const tree = buildTree(simplified);
      setDukes(tree);

      window.scrollTo(0, 0);

      if (treeRef.current) {
        const nodeHeight = 150; 
        const depth = calculateDepth(tree); 
        const height = nodeHeight * depth + 75; 

        setContainerHeight(height);
      }
    });
  }, [startNode]);

  const calculateDepth = (node, depth = 0) => {
    if (!node.children || node.children.length === 0) {
      return depth;
    }
    return Math.max(...node.children.map(child => calculateDepth(child, depth + 1)));
  };

  const nodeSize = { x: 120, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -nodeSize.x/2 };

  return (
    <div id="treeWrapper" style={{ position: 'relative', width: '100%', height: containerHeight }}>
      <ul className='map-cartouche'>
        <li onClick={() => handleStartNodeClick(228)}>Рюриковичи</li>
        <ul>
          <li onClick={() => handleStartNodeClick(13)}>Рогволожи внуци</li>
          <li onClick={() => handleStartNodeClick(121)}>Мономашичи</li>
          <li onClick={() => handleStartNodeClick(7)}>Ольговичи</li>
        </ul>
      </ul>
      <Tree 
          key = {treeKey}
          ref={treeRef}
          data={dukes} 
          orientation={'vertical'}
          translate={{ x: window.innerWidth / 2, y: 0 }}
          zoomable={false}
          draggable={true}
          separation= {{ nonSiblings: 0.9, siblings: 0.9 }}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
        />
    </div>
  );
}; 

export default Genealogy;
