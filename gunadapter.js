
;(function(){

  /* UNBUILD */
  var root;
  if(typeof window !== "undefined"){ root = window }
  if(typeof global !== "undefined"){ root = global }
  root = root || {};
  var console = root.console || {log: function(){}};
  function USE(arg, req){
    return req? require(arg) : arg.slice? USE[R(arg)] : function(mod, path){
      arg(mod = {exports: {}});
      USE[R(path)] = mod.exports;
    }
    function R(p){
      return p.split('/').slice(-1).toString().replace('.js','');
    }
  }
  if(typeof module !== "undefined"){ var common = module }
  /* UNBUILD */

  ;USE(function(module){
    console.log("init adapter");
    // We do this with a GUN adapter, we first listen to when a gun instance is created (and when its options change)
    Gun.on('opt', function(at){
      //if(!at.sea){ // only add SEA once per instance, on the "at" context.
        //console.log("int?");
        //at.sea = {own: {}};
        at.on('in', security, at); // now listen to all input data, acting as a firewall.
        //at.on('out', signature, at); // and output listeners, to encrypt outgoing data.
        //at.on('node', each, at);
      //}
      this.to.next(at); // make sure to call the "next" middleware adapter.
    });

    function security(msg){
      var at = this.as, sea = at.sea, to = this.to;
      if(at.opt.faith && (msg._||noop).faith){ // you probably shouldn't have faith in this!
        this.to.next(msg); // why do we allow skipping security? I'm very scared about it actually.
        return; // but so that way storage adapters that already verified something can get performance boost. This was a community requested feature. If anybody finds an exploit with it, please report immediately. It should only be exploitable if you have XSS control anyways, which if you do, you can bypass security regardless of this.
      }
      if(msg.get){
        var soul = msg.get['#'];
        //console.log(msg.get);
        if(soul){ // for now, only allow direct IDs to be read.
          console.log('soul',soul);
          if(typeof soul !== 'string'){ return to.next(msg) } // do not handle lexical cursors.
          if('alias' === soul){ // Allow reading the list of usernames/aliases in the system?
            return to.next(msg); // yes.
          } else
          if('~@' === soul.slice(0,2)){ // Allow reading the list of public keys associated with an alias?
            return to.next(msg); // yes.
          } else { // Allow reading everything?
            return to.next(msg); // yes // TODO: No! Make this a callback/event that people can filter on.
          }
        }
      }

      if(msg.put){
        console.log("PUT???");
        var check = {}, each = {}, u;
        each.node = function(node, soul){
          console.log("soul",soul)
          if(Gun.obj.empty(node, '_')){ return check['node'+soul] = 0 } // ignore empty updates, don't reject them.
          Gun.obj.map(node, each.way, {soul: soul, node: node});
        };

        each.alias = function(val, key, node, soul){ // Example: {_:#~@, ~@alice: {#~@alice}}
          if(!val){ return each.end({err: "Data must exist!"}) } // data MUST exist
          if('~@'+key === Gun.val.link.is(val)){ return check['alias'+key] = 0 } // in fact, it must be EXACTLY equal to itself
          each.end({err: "Mismatching alias."}); // if it isn't, reject.
        };
        each.pubs = function(val, key, node, soul){ // Example: {_:#~@alice, ~asdf: {#~asdf}}
          if(!val){ return each.end({err: "Alias must exist!"}) } // data MUST exist
          if(key === Gun.val.link.is(val)){ return check['pubs'+soul+key] = 0 } // and the ID must be EXACTLY equal to its property
          each.end({err: "Alias must match!"}); // that way nobody can tamper with the list of public keys.
        };
        each.pub = function(val, key, node, soul, pub, user){ var tmp; // Example: {_:#~asdf, hello:'world'~fdsa}}
          if('pub' === key){
            if(val === pub){ return (check['pub'+soul+key] = 0) } // the account MUST match `pub` property that equals the ID of the public key.
            return each.end({err: "Account must match!"});
          }
          check['user'+soul+key] = 1;
          if(Gun.is(msg.$) && user && user.is && pub === user.is.pub){
            SEA.sign(SEA.opt.prep(tmp = SEA.opt.parse(val), key, node, soul), (user._).sea, function(data){ var rel;
              if(u === data){ return each.end({err: SEA.err || 'Pub signature fail.'}) }
              if(rel = Gun.val.link.is(val)){
                (at.sea.own[rel] = at.sea.own[rel] || {})[pub] = true;
              }
              node[key] = JSON.stringify({':': SEA.opt.unpack(data.m), '~': data.s});
              check['user'+soul+key] = 0;
              each.end({ok: 1});
            }, {check: SEA.opt.pack(tmp, key, node, soul), raw: 1});
            return;
          }
          SEA.verify(SEA.opt.pack(val,key,node,soul), pub, function(data){ var rel, tmp;
            data = SEA.opt.unpack(data, key, node);
            if(u === data){ // make sure the signature matches the account it claims to be on.
              return each.end({err: "Unverified data."}); // reject any updates that are signed with a mismatched account.
            }
            if((rel = Gun.val.link.is(data)) && pub === SEA.opt.pub(rel)){
              (at.sea.own[rel] = at.sea.own[rel] || {})[pub] = true;
            }
            check['user'+soul+key] = 0;
            each.end({ok: 1});
          });
        };
        each.any = function(val, key, node, soul, user){ var tmp, pub;
          if(!(pub = SEA.opt.pub(soul))){
            if(at.opt.secure){
              each.end({err: "Soul is missing public key at '" + key + "'."});
              return;
            }
            // TODO: Ask community if should auto-sign non user-graph data.
            check['any'+soul+key] = 1;
            at.on('secure', function(msg){ this.off();
              check['any'+soul+key] = 0;
              if(at.opt.secure){ msg = null }
              each.end(msg || {err: "Data cannot be modified."});
            }).on.on('secure', msg);
            //each.end({err: "Data cannot be modified."});
            return;
          }
          if(Gun.is(msg.$) && user && user.is && pub === user.is.pub){
            /*var other = Gun.obj.map(at.sea.own[soul], function(v, p){
              if((user.is||{}).pub !== p){ return p }
            });
            if(other){
              each.any(val, key, node, soul);
              return;
            }*/
            check['any'+soul+key] = 1;
            SEA.sign(SEA.opt.prep(tmp = SEA.opt.parse(val), key, node, soul), (user._).sea, function(data){
              if(u === data){ return each.end({err: 'My signature fail.'}) }
              node[key] = JSON.stringify({':': SEA.opt.unpack(data.m), '~': data.s});
              check['any'+soul+key] = 0;
              each.end({ok: 1});
            }, {check: SEA.opt.pack(tmp, key, node, soul), raw: 1});
            return;
          }
          check['any'+soul+key] = 1;
          SEA.verify(SEA.opt.pack(val,key,node,soul), pub, function(data){ var rel;
            data = SEA.opt.unpack(data, key, node);
            if(u === data){ return each.end({err: "Mismatched owner on '" + key + "'."}) } // thanks @rogowski !
            if((rel = Gun.val.link.is(data)) && pub === SEA.opt.pub(rel)){
              (at.sea.own[rel] = at.sea.own[rel] || {})[pub] = true;
            }
            check['any'+soul+key] = 0;
            each.end({ok: 1});
          });
        }

        each.end = function(ctx){ // TODO: Can't you just switch this to each.end = cb?
          if(each.err){ return }
          if((each.err = ctx.err) || ctx.no){
            console.log('NO!', each.err, msg.put); // 451 mistmached data FOR MARTTI
            return;
          }
          if(!each.end.ed){ return }
          if(Gun.obj.map(check, function(no){
            if(no){ return true }
          })){ return }
          (msg._||{}).user = at.user || security; // already been through firewall, does not need to again on out.
          to.next(msg);
        };
        Gun.obj.map(msg.put, each.node);

        //return; // need to manually call next after async.
      }

      to.next(msg); // pass forward any data we do not know how to handle or process (this allows custom security protocols).
    }

    var noop = function(){}, u;
    var fl = Math.floor; // TODO: Still need to fix inconsistent state issue.
    var rel_is = Gun.val.rel.is;
    // TODO: Potential bug? If pub/priv key starts with `-`? IDK how possible.
  })(USE, './index');
    
}());