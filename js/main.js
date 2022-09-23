
Vue.component('my-result-search', {
    props: ['title', 'about', 'img', 'item'],
    template: `  
                <div id="items">
                    <img :src="img" alt="">
                    <div id="aitem-details">
                        <div>
                            <h2>{{title}}</h2>
                            <p>{{about !== null? about.length > 200? about.slice(0, 200) + '...' : about : 'Not Found Synopsis'}}</p>
                        </div>
                        <div>
                            <i class="fa-sharp fa-solid fa-heart" @click.left="send_favourit(item)"></i>
                        </div>
                    </div>
                </div>
     `,

    methods: {
        send_favourit : function(x){
            this.$emit('clicked_fav', x);
        }
    },
})

Vue.component('my-result-favourit', {
    props: ['title', 'img', 'episodes','episodes_count','index', 'allfavourit'],
    template: `  
            <div id="items">
                <div id="aitem-details">
                    <img :src="img" alt="">
                    <div>
                        <h2>{{title.length > 40? title.slice(0, 40) + '...' : title}}</h2>
                        <p>Watched episodes: {{episodes_count}} / {{episodes == null ? 'infinty...' : episodes}}</p>
                    </div>
                </div>
                <div class="all-icons">
                    <i class="fas fa-trash" @click.left="delet_click(index)"></i>
                    <div>
                        <i class="fas fa-minus" @click.left="move_episodes(-1)" v-show="episodes_count !== 0"></i>
                        <i class="fas fa-plus" @click.left="move_episodes(1)" v-show="episodes_count !== episodes"></i>
                    </div>
                </div>
            </div>
     `,

    methods: {
        send_favourit : function(x){
            this.$emit('clicked_fav', x);
        },
        move_episodes: function(x){
                this.$emit('update:episodes_count', this.episodes_count + x);
                window.localStorage.setItem('favourit', JSON.stringify(this.allfavourit));
                console.log(this.allfavourit)
        },
        delet_click: function(x){
            this.$emit('delet_item', x);
        }
    },
})

let app = new Vue({
    el: '#app',
    data: {
        search_value: '',
        my_search: [],
        my_favourit: [],
        count_page: 1,
        url_page: '',
        all_count_pages: '',
        load:{
            load_icon: false,
            active_contain_search: false,
            respons: true, 
        }
      
    },

    created: function(){
        if(localStorage.getItem('favourit') !== null && localStorage.getItem('favourit') !== 'null' && localStorage.getItem('favourit') !== [] && localStorage.getItem('favourit') !== 'undefined'){
            this.my_favourit =  JSON.parse(localStorage.getItem('favourit'));
        }
    },
    methods: {
        'set_load': function(){
            if(this.load.respons == true){
                this.load.load_icon = true;
            }
            if(this.my_search.length > 0){
                this.load.load_icon = false;
                this.load.active_contain_search = true;
            }
        },
        fetch_data: function () {
            return axios.get(this.url_page + this.count_page)
            .then(response => {
                if (response.status == 200 && response.data.data.length !== 0) {
                    this.load.respons = true;
                    this.all_count_pages = response.data.pagination.last_visible_page;
                    response.data.data.forEach(item => {
                            this.my_search.push(item);
                    });
                } else {
                    this.load.respons = false;
                    this.load.load_icon = false;
                }
            })
        },
        get_result: function () {
            if(this.search_value !== ""){
                this.all_count_pages = '';
                this.my_search = [];
                this.count_page = 1;
                this.load.load_icon = true;
                this.load.respons = true;
                this.url_page = `https://api.jikan.moe/v4/anime?q=${this.search_value}&page=`;

                this.fetch_data()
                this.set_load()

            }else{
                this.my_search = [];
            }
        },
        newfavourit: function(x){
            this.my_favourit.push([x, {episodes_count: 0}])
        },
        move_page: function(x){
            window.scrollTo(0,0);
            this.my_search = [];
            this.count_page = this.count_page + x;
            
            this.fetch_data()
            this.set_load()
        }
    },
    watch: {
       'my_favourit': function(){
            window.localStorage.setItem('favourit', JSON.stringify(this.my_favourit));
        },
        'my_search': function(){
            if(this.my_search.length > 0){
                this.set_load()
            }
        },
    },
})