enchant();

window.onload = function () {
	const game = new Game(400, 500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//クリック音読み込み
	const clickSndUrl = "click.wav";						//game.htmlからの相対パス
	game.preload([clickSndUrl]); 				//データを読み込んでおく

	//BGM読み込み
	const nobideshiSndUrl = "nobideshi.mp3";						//game.htmlからの相対パス
	game.preload([nobideshiSndUrl]); 				//データを読み込んでおく
	
	//ぞう山くん画像
	const sakamofuImgUrl = "sakamofu_sozaib.png";						//game.htmlからの相対パス
	game.preload([sakamofuImgUrl]);					//データを読み込んでおく

	//リトライボタン
	const retryImgUrl = "retry_sozai.png";						//game.htmlからの相対パス
	game.preload([retryImgUrl]);					//データを読み込んでおく

	//ツイートボタン
	const tweetImgUrl = "twitter_sozai.png";						//game.htmlからの相対パス
	game.preload([tweetImgUrl]);					//データを読み込んでおく
	
	//背景画像
	const haikeimoriImgUrl = "haikeimori_sozai.png";						//game.htmlからの相対パス
	game.preload([haikeimoriImgUrl]);					//データを読み込んでおく

	//リザルト画像
	const syuukakusaiImgUrl = "syuukakusai_sozai.png";						//game.htmlからの相対パス
	game.preload([syuukakusaiImgUrl]);					//データを読み込んでおく
	
	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		let point = 0;									//ポイント
		let state = 0;								//現在のゲーム状態

		//グローバル変数終わり
		/////////////////////////////////////////////////


		const mainScene = new Scene();					//シーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "white"; 			//mainSceneシーンの背景は黒くした

	
		// 奥の背景画像を設定
		const haikeimoriImg = new Sprite(400, 500);
		haikeimoriImg.image = game.assets["haikeimori_sozai.png"];
		mainScene.addChild(haikeimoriImg);
		
		//ポイント表示テキスト
		const scoreText = new Label(); 					//テキストはLabelクラス
		scoreText.font = "bold 20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		scoreText.color = 'rgba(0,0,0,1)';		//色　RGB+透明度　今回は白
		scoreText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		scoreText.moveTo(10, 20);						//移動位置指定
		mainScene.addChild(scoreText);					//mainSceneシーンにこの画像を埋め込む

		scoreText.text = "現在：" + point;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		game.assets[nobideshiSndUrl].play();
		game.assets[nobideshiSndUrl].loop = true;
		
		//ぞう山ボタン
		const sakamofuImg = new Sprite(103, 98);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		sakamofuImg.moveTo(118, 100);						//ぞう山ボタンの位置
		sakamofuImg.image = game.assets[sakamofuImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		mainScene.addChild(sakamofuImg);					//mainSceneにこのぞう山画像を貼り付ける  


		sakamofuImg.ontouchend = function () {				//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			point++;									//Pointを1増やす
			game.assets[clickSndUrl].clone().play();		//クリックの音を鳴らす。

			
			//クリックしたのでぞう山画像のｘ位置を戻す
			this.x = -200;							//this.xって何？と思った方、Zoyamaの関数内でぞう山の座標を動かすときにはthisを使います。

			//ポイントによって状態Stateを変更する
			if (point < 3) {
				state = 1;
			} else if (point < 6) {
				state = 2;
			} else if (point < 9) {
				state = 3;
			} else if (point < 12) {
				state = 4;
			} else {
				state = 5;
			}

		};



		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {
			if (state == 0) { 							//state=0のとき、初期セット状態(Pointの状態を０にして)
				sakamofuImg.x = -200;						//ぞう山のｘ座標を指定
				sakamofuImg.y = 100;						//ぞう山のy座標を指定
				point = 0;  							//point初期化
				state = 1;							//ゲームスタート状態に移行
			}
			if (state == 1) {							//ゲームスタート　状態１
				sakamofuImg.x += 5;
			}
			if (state == 2) {							//状態２（point３以上なら）
				sakamofuImg.x += 15;
			}
			if (state == 3) {							//状態３（point６以上から）
				sakamofuImg.x += 10;
				sakamofuImg.y = 200 + Math.sin(sakamofuImg.x / 70) * 100; // ｙ座標を振幅100pxのサイン波で移動(Sinは便利なので慣れとくといいよ！)
			}
			if (state == 4) {							//状態４（point９以上から）　4は初期セット状態（state=4）と移動状態（state=4.1)の2つに状態をわける		
				sakamofuImg.y = Math.random() * 400;			//ｙ座標の位置をランダムに決定
				state = 4.1;
			}
			if (state == 4.1) {							//状態４．１ 移動状態
				sakamofuImg.x += 10;						//ただ移動します
			}
			if (state == 5) {							//状態５（point１２以上から）　 ｙ軸が毎フレーム毎に変化する
				sakamofuImg.x += 20;						//移動します。
				sakamofuImg.y = Math.random() * 400;			//ｙ座標の位置を枚フレーム毎にランダム決定
			}

			//現在のテキスト表示
			scoreText.text = "現在：" + point; 				//point変数が変化するので、毎フレームごとにpointの値を読み込んだ文章を表示する

			//ゲームオーバー判定
			if (sakamofuImg.x >= 400) {						//画面端にぞう山画像が行ってしまったら
				game.popScene();					//mainSceneシーンを外す
				game.pushScene(endScene);				//endSceneシーンを読み込ませる

				game.assets[nobideshiSndUrl].stop();

				//ゲームオーバー後のテキスト表示
				gameOverText.text = "収穫おわり！ 記録：" + point + "匹";				//テキストに文字表示 
			}

		};



		////////////////////////////////////////////////////////////////
		//結果画面
		const endScene = new Scene();
		endScene.backgroundColor = "white";

		//GAMEOVER
		const gameOverText = new Label(); 					//テキストはLabelクラス
		gameOverText.font = "bold 20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		gameOverText.color = 'rgba(0,0,0,1)';		//色　RGB+透明度　今回は白
		gameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		gameOverText.moveTo(10, 20);						//移動位置指定
		endScene.addChild(gameOverText);						//endSceneシーンにこの画像を埋め込む

		
		//リトライボタン
		const retryBtn = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		retryBtn.moveTo(50, 350);						//リトライボタンの位置
		retryBtn.image = game.assets[retryImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(retryBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		retryBtn.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			state = 0;
			game.popScene();						//endSceneシーンを外す
			game.pushScene(mainScene);					//mainSceneシーンを入れる
			
			game.assets[nobideshiSndUrl].play();
			game.assets[nobideshiSndUrl].loop = true;
		
		};

		//ツイートボタン
		const tweetBtn = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		tweetBtn.moveTo(230, 350);						//リトライボタンの位置
		tweetBtn.image = game.assets[tweetImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		endScene.addChild(tweetBtn);					//endSceneにこのリトライボタン画像を貼り付ける  

		tweetBtn.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信
			//結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
			const url = encodeURI("https://hajimetokiwa.github.io/sakamofu/");
			window.open("http://twitter.com/intent/tweet?text=さかもふを" + point + "匹収穫した&hashtags=さかもふ収穫祭&url=" + url); //ハッシュタグにahogeタグ付くようにした。
		};

		// リザルト画像を設定
		const syuukakusaiImg = new Sprite(216, 211);
		syuukakusaiImg.moveTo(95, 120);
		syuukakusaiImg.image = game.assets["syuukakusai_sozai.png"];
		endScene.addChild(syuukakusaiImg);

	};
	game.start();
};
