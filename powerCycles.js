var extend = function () {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;
	var length = arguments.length;

	// Check if a deep merge
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for ( var prop in obj ) {
			if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
				// If deep merge and property is an object, merge properties
				if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
					extended[prop] = extend( true, extended[prop], obj[prop] );
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for ( ; i < length; i++ ) {
		var obj = arguments[i];
		merge(obj);
	}
	return extended;
};

var PowerCycle = function(options) {

  var $o = extend({
    cycle: "otto",
    stage1: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage2: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage3: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage4: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage5: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    
    Win: {val: null, units: "kJ"},
    Wout: {val: null, units: "kJ"},
    Wnet: {val: null, units: "kJ"},
    Qin: {val: null, units: "kJ"},
    Qout: {val: null, units: "kJ"},
    Qnet: {val: null, units: "kJ"},
    mep: {val: null, units: "kPa"},
    cp: {val: null, units: "kJ/kg-K"},
    cv: {val: null, units: "kJ/kg-K"},
    
    k: null,
    n: null,
    r: null,
    rp: null   
  }, options);
  
  $o.cycle = $o.cycle.toLowerCase().trim();
  
  function handler() {
    
    var $arr = null;
    var i = 0;
    
    if ($o.cycle == "otto") {          
      
      for (i = 0; i < 40; i++) {
        
        //Isentropic Compression
        $arr = isentropic($o.stage1, $o.stage2, false);
        //console.log($arr);
        //console.log("");
        $o.stage1 = $arr[0];
        $o.stage2 = $arr[1];

        //Constant Volume
        $arr = constantVolume($o.stage2, $o.stage3, false);
        //console.log($arr);
        //console.log("");
        $o.stage2 = $arr[0];
        $o.stage3 = $arr[1];


        //Isentropic Expansion
        $arr = isentropic($o.stage3, $o.stage4, true);
        //console.log($arr);
        //console.log("");
        $o.stage3 = $arr[0];
        $o.stage4 = $arr[1];


        //Constant Volume
        $arr = constantVolume($o.stage4, $o.stage1, true);
        //console.log($arr);
        //console.log("");
        $o.stage4 = $arr[0];
        $o.stage1 = $arr[1];
        
      }      
    }
    else {
      
    }
    
    $o.Wout.val = Math.abs($o.Wout.val);
    $o.Win.val = Math.abs($o.Win.val);
    $o.Qin.val = Math.abs($o.Qin.val);
    $o.Qout.val = Math.abs($o.Qout.val);
    
    toConsole();
    
    
  }
  
  function toConsole() {
    console.log("--------Stage 1--------");
    console.log("p: " + $o.stage1.p.val);
    console.log("T: " + $o.stage1.T.val);
    console.log("v: " + $o.stage1.v.val);
    console.log("");
    
    console.log("--------Stage 2--------");
    console.log("p: " + $o.stage2.p.val);
    console.log("T: " + $o.stage2.T.val);
    console.log("v: " + $o.stage2.v.val);
    console.log("");
    
    console.log("--------Stage 3--------");
    console.log("p: " + $o.stage3.p.val);
    console.log("T: " + $o.stage3.T.val);
    console.log("v: " + $o.stage3.v.val);
    console.log("");
    
    console.log("--------Stage 4--------");
    console.log("p: " + $o.stage4.p.val);
    console.log("T: " + $o.stage4.T.val);
    console.log("v: " + $o.stage4.v.val);
    console.log("");
    
    console.log("--------OTHER-------");
    console.log("Win: " + $o.Win.val);
    console.log("Wout: " + $o.Wout.val);
    console.log("Qin: " + $o.Qin.val);
    console.log("Qout: " + $o.Qout.val);
    console.log("Wnet: " + $o.Wnet.val);
    console.log("Qnet: " + $o.Qnet.val);
    console.log("mep: " + $o.mep.val);
    console.log("n: " + $o.n);
    console.log("r: " + $o.r);
    console.log("k: " + $o.k);
    console.log("cv: " + $o.cv.val);
    console.log("cp: " + $o.cp.val);
    
  }
  
  
  function isentropic($a, $b, isExpansion) {   
    checkVals($a, $b, isExpansion);
    
    
    //If T1 is unknown
    if (!$a.T.val) {
      //T1 = T2 / (v1/v2)^(k-1)
      if ($b.T.val && $a.v.val && $b.v.val && $o.k) {
        $a.T.val = $b.T.val / ( Math.pow(($a.v.val / $b.v.val), ($o.k - 1)));
      }      
      
      //T1 = T2 / (r^(k-1))
      else if ($b.T.val && $o.r && $o.k) {
        $a.T.val = $b.T.val / (Math.pow($o.r, ($o.k - 1)));
      }
      
      //T1 = (p1 * v1 * T2) / (p2 * v2)
      else if ($b.T.val && $a.p.val && $b.p.val && $a.v.val && $b.v.val) {
        $a.T.val = ($a.p.val * $a.v.val * $b.T.val) / ($b.p.val * $b.v.val);
      }
      
      //T1 = (p1 * r * T2) / (p2)
      else if ($b.T.val && $a.p.val && $b.p.val && $o.r) {
        $a.T.val = ($a.p.val * $o.r * $b.T.val) / ($b.p.val);
      }      
    }
    
    if (!$o.stage1.T.val) {
      if ($o.cycle == "otto" && $o.n && $o.stage2.T.val) {
        $o.stage1.T.val = $o.stage2.T.val * (1 - $o.n);
      }
    }
    if (!$o.stage2.T.val) {
      if ($o.cycle == "otto" && $o.n && $o.stage1.T.val) {
        $o.stage2.T.val = $o.stage1.T.val / (1 - $o.n);
      }
    }
    
    //If T2 is unknown
    if (!$b.T.val) {
      
      //T2 = T1 * (v1/v2)^(k-1)
      if ($a.T.val && $a.v.val && $b.v.val && $o.k) {
        $b.T.val = $a.T.val * Math.pow(parseFloat($a.v.val / $b.v.val), ($o.k - 1));
      }
      
      //T2 = T1 * r^(k-1)
      else if ($a.T.val && $o.r && $o.k) {
        //console.log("SOLVING T2");
        $b.T.val = $a.T.val * (Math.pow($o.r, ($o.k - 1)));
        //console.log($b.T.val);
      }   
      
      //T2 = (p2 * v2 * T1) / (p1 * v1)
      else if ($a.T.val && $a.p.val && $b.p.val && $a.v.val && $b.v.val) {
        $b.T.val = ($b.p.val * $b.v.val * $a.T.val) / ($a.p.val * $a.v.val);
      }
      
      //T2 = (p2 * T1) / (p1 * r)
      else if ($a.T.val && $b.p.val && $a.p.val && $o.r) {
        $b.T.val = ($b.p.val * $a.T.val) / ($a.p.val * $o.r);
      }     
    }  
    
    //If P1 is unknown
    if (!$a.p.val) {      
      //P1 = P2 * (v2/v1) * (T1/T2)
      if ($b.p.val && $a.v.val && $b.v.val && $a.T.val && $b.T.val) {
        $a.p.val = $b.p.val * ($b.v.val / $a.v.val) * ($a.T.val / $b.T.val);
      }
      
      //P1 = P2 * (1/r) * (T1/T2)
      else if ($b.p.val && $o.r && $b.T.val && $a.T.val) {
        $a.p.val = $b.p.val * (1/$o.r) * ($a.T.val / $b.T.val);
      }      
    }
    
    
    
    //If P2 is unknown
    if (!$b.p.val) {      
      //P2 = P1 * (v1/v2) * (T2/T1)
      if ($a.p.val && $a.v.val && $b.v.val && $a.T.val && $b.T.val) {
        $b.p.val = $a.p.val * ($a.v.val / $b.v.val) * ($b.T.val / $a.T.val);
      }
      
      //P2 = P1 * r * (T2/T1)
      else if ($a.p.val && $o.r && $b.T.val && $a.T.val) {     
        $b.p.val = $a.p.val * $o.r * ($b.T.val / $a.T.val);
      }      
    }
    
    //If v1 is unknown
    if (!$a.v.val) {      
      //v1 = r * v2
      if ($o.r && $b.v.val) {
        $a.v.val = $o.r * $b.v.val;
      }      
    }  
    //If v2 is unknown
    if (!$b.v.val) {      
      //v2 = v1 / r
      if ($o.r && $a.v.val) {
        $b.v.val = $a.v.val / $o.r;
      }      
    }   
    
    
    
    checkVals($a, $b, isExpansion);
    
    return [$a, $b];
    
  }
  
  function constantVolume($b, $c, isInvert) {
    checkVals($b, $c, isInvert);
    
    //if P2 is unknown
    if (!$b.p.val) {
      
      //P2 = (P3 * v3 * T2) / (T3 * v2)
      if ($c.p.val && $c.v.val && $b.T.val && $c.T.val && $b.v.val) {        
        $b.p.val = ($c.p.val * $c.v.val * $b.T.val) / ($c.T.val * $b.v.val);
      }     
      
    }
    
    //If P3 is unknown
    if (!$c.p.val) {
      
      //P3 = P2 * (T3/T2)
      if ($b.p.val && $c.T.val && $b.T.val) {
        $c.p.val = $b.p.val * ($c.T.val / $b.T.val);
      }
      
    }
    
    //If T2 is unknown
    if (!$b.T.val) {
      
      //T2 = T3 * (p2 * v2) / (p3 * v3)
      if ($c.T.val && $b.p.val && $b.v.val && $c.p.val && $c.v.val) {
        $b.T.val = $c.T.val * ($b.p.val * $b.v.val) / ($c.p.val * $c.v.val); 
      }
      
      //T2 = T3 - Qin/cv
      else if ($o.Qin.val && $o.cv.val && $c.T.val) {
        $b.T.val = $c.T.val - ($o.Qin.val / $o.cv.val); 
      }
      
    }
    
    //If T3 is unknown
    if (!$c.T.val) {
      
      //T3 = T2 * (p3 * v3) / (p2 * v2)
      if ($b.T.val && $c.p.val && $c.v.val && $b.p.val && $b.v.val) {
        $c.T.val = $b.T.val * ($c.p.val * $c.v.val) / ($b.p.val * $b.v.val); 
      }
      //T2 = T3 - Qin/cv
      else if ($o.Qin.val && $o.cv.val && $b.T.val) {
        $c.T.val = ($o.Qin.val / $o.cv.val) + $b.T.val; 
      }
      
    }
    
    
    //If V2 is unknown
    if (!$b.v.val) {
      
      //v2 = v3 * (p3 * T2) / (p2 * T3)
      if ($c.v.val && $c.p.val && $b.T.val && $c.p.val && $c.T.val) {
        $b.v.val = $c.v.val * ($c.p.val * $b.T.val) / ($b.p.val * $c.T.val);
      }
      
    }
    //If V3 is unknown
    if (!$c.v.val) {
      
      //v3 = v2 * (p2 * T3) / (p3 * T2)
      if ($b.v.val && $b.p.val && $c.T.val && $b.p.val && $b.T.val) {
        $c.v.val = $b.v.val * ($b.p.val * $c.T.val) / ($c.p.val * $b.T.val);
      }      
    }   
    
    checkVals($b, $c, isInvert);
    
    return [$b, $c];
  }
  
  
  
  function checkVals($x, $y, isExpansion, count) {
    var cnt = (typeof(count) === 'undefined' || count == null || isNaN(count)) ? 0 : count;
    cnt++;
    var flip = (typeof(isExpansion) === 'undefined' || isExpansion == null || !isExpansion) ? false : true;
    
    var $a = (flip) ? $y : $x;
    var $b = (flip) ? $x : $y;
    
    
    //If r is unknown
    if (!$o.r) {      
      //if v1 and v2 are known  
      if ($a.v.val && $b.v.val) {
        //r = v1/v2
        $o.r = parseFloat($a.v.val / $b.v.val);
      }
      
      //if T1, T2, and k are known
      if ($a.T.val && $b.T.val && $o.k) {
        //r = (T2/T1)^(1/(k-1))
        $o.r = Math.pow(($b.T.val / $a.T.val), (1 / ($o.k - 1)));
      }      
    }
    
    
    //If k is unknown
    if (!$o.k) {      
      
      //if cp and cv are found
      if ($o.cp.val && $o.cv.val) {
        //k = cp / cv
        $o.k = parseFloat($o.cp.val / $o.cv.val);
      }
      
      //If T2, T1, and r have been found
      else if ($a.T.val && $b.T.val && $o.r) {
        //k = 1 + (LN(T2/T1) / LN(r))
        $o.k = 1 + (parseFloat(Math.log($b.T.val / $a.T.val)) / Math.log($o.r));
      }      
    }
    
    //If cp is unknown
    if (!$o.cp.val) {
      
      //if k and cv are known
      if ($o.k && $o.cv.val) {
        //cp = k * cv
        $o.cp.val = $o.k * $o.cv.val;
      }     
    }
    
    //If cv is unknown
    if (!$o.cv.val) {
      
      //If k and cp are known
      if ($o.k && $o.cp.val) {
        //cv = cp / k
        $o.cv.val = parseFloat($o.cp.val / $o.k);
      }
      else if (!flip && $o.Win.val && $a.T.val && $b.T.val) {
        $o.cv.val = $o.Win.val / ($a.T.val - $b.T.val);
      }
      else if (flip && $o.Wout.val && $a.T.val && $b.T.val) {
        $o.cv.val = $o.Wout.val / ($a.T.val - $b.T.val);
      }            
    }
        
    
    if (!$o.Win.val) {
      if ($o.cycle == "otto") {
        if ($o.cv.val && $o.stage1.T.val && $o.stage2.T.val) {
          $o.Win.val = $o.cv.val * ($o.stage1.T.val - $o.stage2.T.val);
        }
      }
    }
    if (!$o.Wout.val) {
      if ($o.cycle == "otto") {
        if ($o.cv.val && $o.stage3.T.val && $o.stage4.T.val) {
          $o.Wout.val = $o.cv.val * ($o.stage4.T.val - $o.stage3.T.val);
        }
      }
    }
    
    if (!$o.Qin.val) {
      if ($o.cycle == "otto") {
        if ($o.cv.val && $o.stage2.T.val && $o.stage3.T.val) {
          $o.Qin.val = $o.cv.val * ($o.stage3.T.val - $o.stage2.T.val);
        }
      }
    }
    
    if (!$o.Qout.val) {
      if ($o.cycle == "otto") {
        if ($o.cv.val && $o.stage1.T.val && $o.stage4.T.val) {
          $o.Qout.val = $o.cv.val * ($o.stage1.T.val - $o.stage4.T.val);
        }
      }
    }
    
    
    //if Wnet is unknown
    if (!$o.Wnet.val) {      
      if ($o.Win.val && $o.Wout.val) {
        $o.Wnet.val = (0-$o.Win.val) + $o.Wout.val;
      }      
      else if ($o.n && $o.Qin.val) {
        $o.Wnet.val = $o.n * $o.Qin.val;
      }
      else if ($o.Qnet.val) {
        $o.Wnet.val = $o.Qnet.val;
      }
    }
    
    //If Qnet is unknown 
    if (!$o.Qnet.val) {
      if ($o.Wnet.val) {
        $o.Qnet.val = $o.Wnet.val;
      }
      else if ($o.Qin.val && $o.Qout.val) {
        $o.Qnet.val = $o.Qin.val - $o.Qout.val;
      }
    }
    
    
    //if n (efficiency) is unknown
    if (!$o.n) {
      
      if ($o.cycle == "otto") {
        if ($a.T.val && $b.T.val) {
          //n = 1 - (T1/T2)
          $o.n = 1 - parseFloat($a.T.val / $b.T.val);
        }
        else if ($o.r && $o.k) {
          //n = 1 - (1 / r^(k-1))
          $o.n = 1 - (1 / Math.pow($o.r, ($o.k - 1)));
        }
        else if ($o.Wnet.val && $o.Qin.val) {
          //n = (Wnet / Qin)
          $o.n = $o.Wnet.val / $o.Qin.val;
        }
      }
      
      else if ($o.cycle == "diesel") {
        
      }
      
      else if ($o.cycle == "dual") {
        
      }      
    }
    
    //if mep (mean effective pressure) is unknown
    if (!$o.mep.val) {
      if ($o.Wnet.val && $o.stage1.v.val && $o.stage2.v.val) {
        $o.mep.val = $o.Wnet.val / (Math.abs($o.stage2.v.val - $o.stage1.v.val));
      }     
    }
    
        
    
  } 
  
  handler();
}

PowerCycle({
    cycle: "otto",
    stage1: {
      p: {val: 100, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: 300, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage2: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage3: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage4: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    stage5: {
      p: {val: null, units: "kPa"},
      v: {val: null, units: "m3/kg"},
      T: {val: null, units: "K"},
      h: {val: null, units: "kJ/kg"},
      s: {val: null, units: "kJ-kg/K"}
    },
    
    Win: {val: null, units: "kJ"},
    Wout: {val: null, units: "kJ"},
    Wnet: {val: null, units: "kJ"},
    Qin: {val: 800, units: "kJ"},
    Qout: {val: null, units: "kJ"},
    Qnet: {val: null, units: "kJ"},
    mep: {val: null, units: "kPa"},
    cp: {val: null, units: "kJ/kg-K"},
    cv: {val: 0.834, units: "kJ/kg-K"},
    
    k: 1.344,
    n: null,
    r: 8,
    rp: null
  });















































