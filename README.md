<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Gammes" />
  <title>Gammes</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body { background: #E8EDF5; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; overscroll-behavior: none; }
    ::-webkit-scrollbar { display: none; }
    button { -webkit-appearance: none; }
  </style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState } = React;

const NOTES    = ["Do","Do#","Ré","Ré#","Mi","Fa","Fa#","Sol","Sol#","La","La#","Si"];
const NOTES_EN = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const SCALE_CATEGORIES = {
  classiques: { label:"Classiques", scales:{
    majeure:            { label:"Majeure",          intervals:[0,2,4,5,7,9,11], color:"#4F8EF7", description:"Joyeuse et lumineuse",       genres:"Pop, Classique" },
    mineure_naturelle:  { label:"Min. naturelle",   intervals:[0,2,3,5,7,8,10], color:"#8B5CF6", description:"Mélancolique et expressive",  genres:"Rock, Classique" },
    mineure_harmonique: { label:"Min. harmonique",  intervals:[0,2,3,5,7,8,11], color:"#7C3AED", description:"Tension dramatique sur la V", genres:"Classique, Metal" },
    mineure_melodique:  { label:"Min. mélodique",   intervals:[0,2,3,5,7,9,11], color:"#6D28D9", description:"Ascendante jazzifiée",        genres:"Jazz, Classique" },
  }},
  pentatoniques: { label:"Pentatoniques", scales:{
    pentatonique_maj: { label:"Penta. majeure", intervals:[0,2,4,7,9],    color:"#10B981", description:"Douce et universelle",    genres:"Country, Pop" },
    pentatonique_min: { label:"Penta. mineure", intervals:[0,3,5,7,10],   color:"#F59E0B", description:"Blues, rock, soul",        genres:"Rock, Blues" },
    blues:            { label:"Blues",           intervals:[0,3,5,6,7,10], color:"#EF4444", description:"La blue note qui gratte",  genres:"Blues, Rock, Jazz" },
    blues_majeur:     { label:"Blues majeur",    intervals:[0,2,3,4,7,9],  color:"#F97316", description:"Blues ensoleillé",         genres:"Blues, Shuffle" },
  }},
  modes: { label:"Modes grecs", scales:{
    dorienne:     { label:"Dorienne",       intervals:[0,2,3,5,7,9,10], color:"#06B6D4", description:"Jazz et funk moderne",         genres:"Jazz, Funk" },
    phrygienne:   { label:"Phrygienne",     intervals:[0,1,3,5,7,8,10], color:"#0EA5E9", description:"Sombre et espagnole",          genres:"Metal, Flamenco" },
    lydienne:     { label:"Lydienne",       intervals:[0,2,4,6,7,9,11], color:"#38BDF8", description:"Planante et éthérée",          genres:"Film, Pop" },
    mixolydienne: { label:"Mixolydienne",   intervals:[0,2,4,5,7,9,10], color:"#7DD3FC", description:"Rock et blues tonal",          genres:"Rock, Blues" },
    locrien:      { label:"Locrienne",      intervals:[0,1,3,5,6,8,10], color:"#0369A1", description:"La plus sombre des modes",     genres:"Metal, Jazz" },
    phrygien_dom: { label:"Phrygien dom.",  intervals:[0,1,4,5,7,8,10], color:"#1D4ED8", description:"Oriental et flamenco",         genres:"Flamenco, Metal" },
  }},
  jazz: { label:"Jazz & Modal", scales:{
    whole_tone:    { label:"Tons entiers",     intervals:[0,2,4,6,8,10],       color:"#EC4899", description:"Impressionniste flottant",    genres:"Jazz, Film" },
    diminuee:      { label:"Diminuée (H-W)",   intervals:[0,1,3,4,6,7,9,10],  color:"#DB2777", description:"Tension symétrique",          genres:"Jazz, Bebop" },
    diminuee_wh:   { label:"Diminuée (W-H)",   intervals:[0,2,3,5,6,8,9,11],  color:"#BE185D", description:"Sur accord dim7",             genres:"Jazz" },
    lydienne_dom:  { label:"Lydienne dom.",     intervals:[0,2,4,6,7,9,10],    color:"#A21CAF", description:"Jazz fusion lumineux",         genres:"Jazz Fusion" },
    altered:       { label:"Altérée",           intervals:[0,1,3,4,6,8,10],    color:"#86198F", description:"Sur V7alt en jazz",            genres:"Jazz, Bebop" },
    bebop_maj:     { label:"Bebop majeure",     intervals:[0,2,4,5,7,8,9,11],  color:"#701A75", description:"Passing tone caractéristique", genres:"Bebop, Swing" },
  }},
  monde: { label:"Monde", scales:{
    egyptienne:  { label:"Égyptienne",      intervals:[0,2,5,7,10],        color:"#D97706", description:"Pentatonique suspendue",    genres:"World, Moyen-Orient" },
    japonaise:   { label:"Hirajoshi",       intervals:[0,2,3,7,8],         color:"#B45309", description:"Traditionnelle japonaise",  genres:"World, Ambiant" },
    hongroise:   { label:"Hongroise min.",  intervals:[0,2,3,6,7,8,11],    color:"#92400E", description:"Gitane et dramatique",      genres:"Musique du monde" },
    arabe:       { label:"Hijaz (Arabe)",   intervals:[0,1,4,5,7,8,10],    color:"#78350F", description:"Couleur orientale",         genres:"Moyen-Orient, Flamenco" },
    enigmatique: { label:"Énigmatique",     intervals:[0,1,4,6,8,10,11],   color:"#451A03", description:"Verdi, mystérieuse",        genres:"Expérimental" },
  }},
};

const SCALE_TYPES = Object.values(SCALE_CATEGORIES).reduce((a,c) => ({...a,...c.scales}), {});
const INSTRUMENTS = { piano:{label:"Piano",emoji:"🎹"}, guitare:{label:"Guitare",emoji:"🎸"}, basse:{label:"Basse",emoji:"🎸"} };
const GUITAR_STRINGS=[28,23,19,14,9,4], GUITAR_NAMES=["E","B","G","D","A","E"];
const BASS_STRINGS=[19,14,9,4],         BASS_NAMES=["G","D","A","E"];
const FRETS=12, MARKERS=[3,5,7,9,12];
const WHITE_KEYS=[0,2,4,5,7,9,11];
const BLACK_SEM=[1,3,null,6,8,10,null];
const DEG=["I","II","III","IV","V","VI","VII","VIII"];
const TIPS={
  piano:(r,s)=>`Joue ${NOTES[r]} ${s} main droite d'abord, puis main gauche, puis ensemble. Commence à 60 bpm.`,
  guitare:(r,s)=>`Repère la fondamentale ${NOTES[r]} sur chaque corde. Monte et descends le pattern, puis explore en diagonale.`,
  basse:(r,s)=>`Joue la gamme de ${NOTES[r]} ${s} avec le métronome. Accentue les temps forts et explore les positions sur le manche.`,
};

function getScale(root,ivs){ return ivs.map(i=>(root+i)%12); }
function nLabel(i){ return NOTES[i%12]; }

function PianoOctave({oct,scaleNotes,root,color}){
  return (
    <div style={{position:"relative",display:"flex",height:90,flexShrink:0}}>
      {WHITE_KEYS.map((s,i)=>{
        const n=(s+oct)%12, isSc=scaleNotes.includes(n), isR=n===root;
        return <div key={i} style={{position:"relative",width:26,height:90,background:isR?color:isSc?color+"44":"white",border:"1px solid #CBD5E1",borderRadius:"0 0 4px 4px",display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:3,fontSize:7,fontWeight:isR?700:500,color:isR?"white":isSc?"#1E40AF":"#94A3B8",zIndex:1,flexShrink:0}}>
          {isSc&&nLabel(n)}
        </div>;
      })}
      {BLACK_SEM.map((s,i)=>{
        if(s===null)return null;
        const n=(s+oct)%12, isSc=scaleNotes.includes(n), isR=n===root;
        return <div key={"b"+i} style={{position:"absolute",left:i*26+17,top:0,width:17,height:56,background:isR?color:isSc?"#3B82F6":"#1E293B",borderRadius:"0 0 3px 3px",zIndex:2,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:2,fontSize:6,color:isSc?"white":"#475569",fontWeight:600}}>
          {isSc&&nLabel(n)}
        </div>;
      })}
    </div>
  );
}

function Piano({scaleNotes,root,color}){
  return (
    <div style={{overflowX:"auto",paddingBottom:6}}>
      <div style={{display:"flex",gap:2,minWidth:"max-content"}}>
        {[0,12].map(o=><PianoOctave key={o} oct={o} scaleNotes={scaleNotes} root={root} color={color}/>)}
      </div>
      <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
        <Leg color={color} label="Fondamentale"/>
        <Leg color={color+"44"} label="Note de la gamme" dark/>
      </div>
    </div>
  );
}

function Fretboard({strings,names,scaleNotes,root,color}){
  return (
    <div style={{overflowX:"auto"}}>
      <div style={{minWidth:280}}>
        <div style={{display:"flex",paddingLeft:24}}>
          {[0,...Array.from({length:FRETS},(_,f)=>f+1)].map(f=>(
            <div key={f} style={{width:32,flexShrink:0,fontSize:8,textAlign:"center",color:MARKERS.includes(f)?"#64748B":"#CBD5E1",fontWeight:MARKERS.includes(f)?700:400}}>
              {f}{MARKERS.includes(f)&&<span style={{display:"block",fontSize:6}}>●</span>}
            </div>
          ))}
        </div>
        {strings.map((open,si)=>(
          <div key={si} style={{display:"flex",alignItems:"center",marginBottom:2}}>
            <div style={{width:24,fontSize:9,fontWeight:700,color:"#64748B",textAlign:"center",flexShrink:0}}>{names[si]}</div>
            {Array.from({length:FRETS+1},(_,fret)=>{
              const n=(open+fret)%12, isSc=scaleNotes.includes(n), isR=n===root;
              const thick=si>=strings.length-2?2:si>=strings.length-4?1.5:1;
              return (
                <div key={fret} style={{width:32,height:28,flexShrink:0,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{position:"absolute",top:"50%",left:0,right:0,height:thick,background:"#94A3B8",transform:"translateY(-50%)",zIndex:0}}/>
                  {fret>0&&<div style={{position:"absolute",left:0,top:2,bottom:2,width:2,background:"#CBD5E1",zIndex:1,borderRadius:1}}/>}
                  {isSc&&<div style={{position:"relative",zIndex:2,width:18,height:18,borderRadius:"50%",background:isR?color:"#1E293B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:700,color:"white",boxShadow:isR?`0 0 0 2px ${color}66`:"none"}}>{nLabel(n)}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
        <Leg color={color} label="Fondamentale"/>
        <Leg color="#1E293B" label="Note de la gamme"/>
      </div>
    </div>
  );
}

function Leg({color,label}){
  return <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748B"}}>
    <div style={{width:11,height:11,borderRadius:"50%",background:color,flexShrink:0}}/>
    {label}
  </div>;
}

function ScaleCard({k,selected,onClick}){
  const s=SCALE_TYPES[k];
  return <button onClick={onClick} style={{background:selected?s.color:"#F8FAFC",border:`2px solid ${selected?s.color:"#E2E8F0"}`,borderRadius:12,padding:"9px 11px",cursor:"pointer",textAlign:"left",minWidth:125,flexShrink:0}}>
    <div style={{fontSize:11,fontWeight:800,color:selected?"white":"#1E293B",marginBottom:2}}>{s.label}</div>
    <div style={{fontSize:9,color:selected?"rgba(255,255,255,.7)":"#94A3B8",marginBottom:4}}>{s.description}</div>
    <div style={{fontSize:8,fontWeight:700,color:selected?"rgba(255,255,255,.55)":s.color,textTransform:"uppercase",letterSpacing:.5}}>{s.genres}</div>
  </button>;
}

function NoteBtn({n,i,selected,onClick,color}){
  return <button onClick={onClick} style={{width:36,height:36,borderRadius:9,border:`2px solid ${selected?color:"#E2E8F0"}`,background:selected?color:"#F8FAFC",color:selected?"white":"#1E293B",fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0}}>{n}</button>;
}

function Section({label,children}){
  return <div style={{marginBottom:18}}>
    <div style={{fontSize:9,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:1.5,marginBottom:9}}>{label}</div>
    {children}
  </div>;
}

function App(){
  const [root,setRoot]=useState(0);
  const [scType,setScType]=useState("majeure");
  const [cat,setCat]=useState("classiques");
  const [inst,setInst]=useState("piano");
  const [info,setInfo]=useState(false);

  const scale=SCALE_TYPES[scType];
  const scNotes=getScale(root,scale.intervals);

  function changeCat(c){
    setCat(c);
    setScType(Object.keys(SCALE_CATEGORIES[c].scales)[0]);
  }

  return (
    <div style={{minHeight:"100vh",background:"#E8EDF5",display:"flex",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:"#fff",display:"flex",flexDirection:"column"}}>
        <div style={{background:"#0F172A",padding:"env(safe-area-inset-top, 14px) 20px 10px",display:"flex",justifyContent:"space-between",fontSize:12,color:"white",fontWeight:600}}>
          <span>9:41</span><span style={{fontSize:15,letterSpacing:-1}}>●●●</span><span>🔋</span>
        </div>
        <div style={{background:"linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)",padding:"18px 18px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:9,color:"#93C5FD",letterSpacing:2,marginBottom:3,textTransform:"uppercase"}}>Révision des gammes</div>
              <h1 style={{margin:0,fontSize:22,fontWeight:800,color:"white",lineHeight:1.1}}>{NOTES[root]} {scale.label}</h1>
              <div style={{fontSize:10,color:"#475569",marginTop:2}}>{scale.genres}</div>
            </div>
            <button onClick={()=>setInfo(!info)} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:10,padding:"7px 9px",color:"white",fontSize:16,cursor:"pointer"}}>ℹ</button>
          </div>
          <div style={{marginTop:12,display:"flex",gap:4,flexWrap:"wrap"}}>
            {scNotes.map((n,i)=>(
              <div key={i} style={{background:i===0?scale.color:"rgba(255,255,255,.1)",borderRadius:7,padding:"2px 8px",fontSize:10,fontWeight:700,color:"white",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <span>{NOTES[n]}</span><span style={{fontSize:7,opacity:.6}}>{DEG[i]}</span>
              </div>
            ))}
          </div>
        </div>
        {info&&<div style={{background:"#EFF6FF",borderBottom:"1px solid #BFDBFE",padding:"11px 18px",fontSize:11,color:"#1E40AF",lineHeight:1.6}}>
          <strong>{scale.label}</strong> — {scale.description}<br/>
          <span style={{fontSize:10,color:"#3B82F6"}}>{scale.intervals.length} notes · Intervalles : {scale.intervals.join(" – ")}</span>
        </div>}
        <div style={{flex:1,padding:"0 14px 40px"}}>
          <div style={{display:"flex",background:"#F1F5F9",borderRadius:12,padding:3,margin:"12px 0"}}>
            {Object.entries(INSTRUMENTS).map(([k,v])=>(
              <button key={k} onClick={()=>setInst(k)} style={{flex:1,padding:"8px 2px",borderRadius:10,border:"none",background:inst===k?"white":"transparent",color:inst===k?"#0F172A":"#94A3B8",fontWeight:700,fontSize:11,cursor:"pointer",boxShadow:inst===k?"0 1px 4px rgba(0,0,0,.1)":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                <span style={{fontSize:15}}>{v.emoji}</span>{v.label}
              </button>
            ))}
          </div>
          <Section label="Tonique">
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {NOTES.map((n,i)=><NoteBtn key={i} n={n} i={i} selected={root===i} onClick={()=>setRoot(i)} color={scale.color}/>)}
            </div>
          </Section>
          <Section label="Type de gamme">
            <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:3,marginBottom:8}}>
              {Object.entries(SCALE_CATEGORIES).map(([k,c])=>(
                <button key={k} onClick={()=>changeCat(k)} style={{padding:"5px 11px",borderRadius:20,border:"none",flexShrink:0,background:cat===k?"#0F172A":"#F1F5F9",color:cat===k?"white":"#64748B",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4}}>
              {Object.keys(SCALE_CATEGORIES[cat].scales).map(k=>(
                <ScaleCard key={k} k={k} selected={scType===k} onClick={()=>setScType(k)}/>
              ))}
            </div>
          </Section>
          <Section label={inst==="piano"?"Clavier":"Manche"}>
            {inst==="piano"&&<Piano scaleNotes={scNotes} root={root} color={scale.color}/>}
            {inst==="guitare"&&<Fretboard strings={GUITAR_STRINGS} names={GUITAR_NAMES} scaleNotes={scNotes} root={root} color={scale.color}/>}
            {inst==="basse"&&<Fretboard strings={BASS_STRINGS} names={BASS_NAMES} scaleNotes={scNotes} root={root} color={scale.color}/>}
          </Section>
          <Section label="Degrés de la gamme">
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              {scNotes.map((n,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",padding:"7px 11px",background:i===0?scale.color+"18":"#F8FAFC",borderRadius:10,border:`1px solid ${i===0?scale.color+"40":"#F1F5F9"}`}}>
                  <div style={{width:24,height:24,borderRadius:7,background:i===0?scale.color:"#E2E8F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:i===0?"white":"#64748B",flexShrink:0,marginRight:10}}>{DEG[i]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>{NOTES[n]}</div>
                    <div style={{fontSize:9,color:"#94A3B8"}}>{NOTES_EN[n]} · +{scale.intervals[i]} demi-tons</div>
                  </div>
                  {i===0&&<div style={{fontSize:8,color:scale.color,fontWeight:700,background:scale.color+"18",padding:"2px 6px",borderRadius:5}}>Tonique</div>}
                </div>
              ))}
            </div>
          </Section>
          <div style={{background:"#0F172A",borderRadius:14,padding:"13px 15px"}}>
            <div style={{fontSize:9,color:"#93C5FD",marginBottom:5,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>💡 Conseil de pratique</div>
            <div style={{fontSize:11,color:"#CBD5E1",lineHeight:1.65}}>{TIPS[inst](root,scale.label)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
</script>
</body>
</html>
